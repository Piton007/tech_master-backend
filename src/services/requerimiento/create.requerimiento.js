import Model from "@/models"
import {connection} from "@/db.manager"
import DateHelper from "@/share/timeHelpers"


export default class CreateRequerimientoService {
    constructor(){

    }
    async run(dto){
        try {
            const requerimiento =  await this.create(dto)
            return {
                id:requerimiento.dataValues.id,
                code:requerimiento.dataValues.code,
                categories:dto.categories,
                documents:(!requerimiento.dataValues.document_urns) ? [] : requerimiento.dataValues.document_urns.split(";"),
                description:dto.description,
                status: requerimiento.dataValues.status,
                fechaCierre: (!requerimiento.fechaCierre)? requerimiento.fechaCierre : new DateHelper(requerimiento.fechaCierre).toString(),
                fechaAsignacion:(!requerimiento.fechaAsignacion)? requerimiento.fechaAsignacion : new DateHelper(requerimiento.fechaAsignacion).toString(),
                fechaCreacion: new DateHelper(requerimiento.dataValues.createdAt).toString(),
                creator: {
                    rol:requerimiento.reportedBy.rol,
                    dni:requerimiento.reportedBy.dni,
                    firstName: requerimiento.reportedBy.firstName,
                    lastName: requerimiento.reportedBy.lastName,
                    priority: requerimiento.reportedBy.priority
                },
                logs:requerimiento.logs.map(x=>({status:x.status,event:x.event,tipo:x.tipo,comment:x.comment,fechaCreacion: new DateHelper(x.createdAt).toString()})),
                supervisedBy: requerimiento.supervisedBy
            }
        } catch (error) {
            console.log(error)
            throw new Error({msg:"Error al crear requerimiento",errors:{requerimiento:"no se pudo crear el requerimiento"}})
        }
    }

    async create(dto){
        let self = this
        return connection.transaction(t=>{
            return Model.Requerimiento.create({
                categories: dto.categories.join(";"),
                description:dto.description,
                status: "pending",
                document_urns:dto.documents.join(";"),
                user_id:dto.auth.id,
                supervisor_id:dto.supervisor_id
            },{transaction:t}).then(requerimiento=>{
                const {id} = requerimiento
                return Model.Requerimiento.update(
                    {code: self.generateCode(id)},
                    {where: [{id}],transaction:t}).then(x=>{

                    return Model.Requerimiento.findAll({
                        where:{
                            id
                        },
                        include:[
                            {model:Model.User,as:"reportedBy"},
                            {model:Model.User, as: "supervisedBy" }
                        ],
                        transaction:t
                        
                    }).then((x)=>{
                        const [requerimiento] = x
                        return Model.Logs.create({
                            requerimiento_id:id,
                            event:`${requerimiento.reportedBy.firstName} ha solicitado un requerimiento`,
                            tipo:"requerimiento",
                            status:"pending",
                            comment:`
                            evento: Creación de requerimiento
                            Ha sido creado por ${requerimiento.reportedBy.firstName} con dni ${requerimiento.reportedBy.dni}`
                        },{transaction:t}).then((log)=>{
                            return {...requerimiento,logs:[log]}
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

            return "REQ"+code
        }
        return "REQ"+id

    }

    validateDTO(dto){
        const errors = {}
        if (!dto.categories.length){
            errors["categories"] = "*Campo obligatorio"
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