import Model from "@/models"
import {connection} from "@/db.manager"
import DateHelper from "@/share/timeHelpers"


export default class CreateIncidenteService {
    constructor(){

    }
    async run(dto){
        try {
            const incidente =  await this.create(dto)
            return {
                id:incidente.id,
                code:incidente.code,
                documents:(!incidente.document_urns) ? [] : incidente.document_urns.split(";"),
                description:incidente.description,
                status: incidente.status,
                fechaCierre: (!incidente.fechaCierre)? incidente.fechaCierre : new DateHelper(incidente.fechaCierre).toString(),
                fechaAsignacion:(!incidente.fechaAsignacion)? incidente.fechaAsignacion : new DateHelper(incidente.fechaAsignacion).toString(),
                fechaCreacion: new DateHelper(incidente.createdAt).toString(),
                creator: {
                    rol:incidente.requestedBy.rol,
                    dni:incidente.requestedBy.dni,
                    firstName: incidente.requestedBy.firstName,
                    lastName: incidente.requestedBy.lastName,
                    priority: incidente.requestedBy.priority
                },
                logs:incidente.logs.map(x=>({status:x.status,event:x.event,tipo:x.tipo,comment:x.comment,fechaCreacion: new DateHelper(x.createdAt).toString()})),
                supervisedBy: (!incidente.supervisedByIncident) ? incidente.supervisedByIncident : {
                    id:incidente.supervisedByIncident.id,
                    email:incidente.supervisedByIncident.email,
                    rol:incidente.supervisedByIncident.rol,
                    dni:incidente.supervisedByIncident.dni,
                    firstName: incidente.supervisedByIncident.firstName,
                    lastName: incidente.supervisedByIncident.lastName,
                    priority: incidente.supervisedByIncident.priority
                },
                affectedBy: (!incidente.affectedBy) ? incidente.affectedBy : {
                    id:incidente.affectedBy.id,
                    email:incidente.affectedBy.email,
                    rol:incidente.affectedBy.rol,
                    dni:incidente.affectedBy.dni,
                    firstName: incidente.affectedBy.firstName,
                    lastName: incidente.affectedBy.lastName,
                    priority: incidente.affectedBy.priority
                },
                category:incidente.categoria,
            }
        } catch (error) {
            console.log(error)
            throw new Error({msg:"Error al crear incidente",errors:{incidente:"no se pudo crear el incidente"}})
        }
    }

    async create(dto){
        let self = this
        return connection.transaction(t=>{
            return Model.Incidente.create({
                description:dto.description,
                status: "pending",
                document_urns:dto.documents.join(";"),
                categoria_id:dto.category_id,
                usuario_solicitante_id:dto.auth.id,
                usuario_afectado_id:dto.affected_id
            },{transaction:t}).then(incidente=>{
                const {id} = incidente
                return Model.Incidente.update(
                    {code: self.generateCode(id)},
                    {where: [{id}],transaction:t}).then(x=>{

                    return Model.Incidente.findAll({
                        where:{
                            id
                        },
                        include:[
                            {model:Model.User,as:"requestedBy"},
                            {model:Model.User, as: "supervisedByIncident"},
                            {model:Model.User,as:'affectedBy'},
                            {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                            {model:Model.IncidenteLogs,as:"logs"}
                        ],
                        transaction:t
                        
                    }).then((x)=>{
                        const [incidente] = x
                        return Model.IncidenteLogs.create({
                            incidente_id:id,
                            event:`${incidente.requestedBy.firstName} ha notificado un incidente`,
                            tipo:"incidente",
                            status:"pending",
                            comment:`
                            evento: Creación de incidente
                            Ha sido creado por ${incidente.requestedBy.firstName} con dni ${incidente.requestedBy.dni}
                            para ${incidente.affectedBy.firstName} con dni ${incidente.affectedBy.dni}
                            `
                        },{transaction:t}).then((log)=>{
                            return {...incidente,logs:[log]}
                        })
                       
                    })
                    

                })
            }); 
        }) 
    }

    generateCode(id)
    {
        const _id = id.toString()
        
        if (_id.length < 4) {
            const  zeros = new Array(4 - _id.length).fill(0).join("")
            const code = zeros + _id

            return "INC"+code
        }
        return "INC"+id

    }

    validateDTO(dto){
        const errors = {}
        if (!dto.category_id){
            errors["categoria"] = "*Campo obligatorio"
        }
        if (!dto.affected_id){
            errors["afectado"] = "*Campo obligatorio"
        }
        if(!dto.description){
            errors["description"] = "*Campo obligatorio"
        }
        if(!(dto.documents instanceof Array)){
            errors["documents"] = "*Campo obligatorio"
        }
        if(Object.keys(errors).length > 0)
            throw new Error({msg:"Invalid Form",errors})
    }

}