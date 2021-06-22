import {connection} from "@/db.manager"
import Model from "@/models"
import DateHelper from "@/share/timeHelpers"

export default class AssignIncidenteService{
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        try {
            const incidente =  await this.assign(dto)
            return this.assembleToResponse(incidente)
            
        } catch (error) {
            console.log(error)
            throw new Error({msg:"Error al asignar",errors:{incidente:"no se pudo asignar el incidente"}})
        }
       
    }


    async assign(dto){
        return connection.transaction(t=>{
            return Model.Incidente.update(
                {
                supervisor_id: dto.user_id,
                status:"in_process", 
                fechaAsignacion: DateHelper.now().value()
                },
                {where: [{code:dto.incidente_code}],transaction:t})
                .then((x)=>{
                    return Model.Incidente.findAll(
                        {where:{code:dto.incidente_code},
                        transaction:t,
                        include:[
                            {model:Model.User,as:"requestedBy"},
                            {model:Model.User, as: "supervisedByIncident"},
                            {model:Model.User,as:'affectedBy'},
                            {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                            {model:Model.IncidenteLogs,as:"logs"}
                            ]}).then(y=>{
                                const [{dataValues:incidente}] = y
                                return Model.IncidenteLogs.create({
                                    incidente_id:incidente.id,
                                    event:`${incidente.supervisedByIncident.firstName} con email: ${incidente.supervisedByIncident.email} ha tomado el incidente`,
                                    comment:`
                                    El incidente ha sido asignado a ${incidente.supervisedByIncident.firstName} 
                                    `,
                                    tipo:"incidente",
                                    status:"in_process"
                                },{transaction:t}).then((log)=>{
                                    return {...incidente,logs:[...incidente.logs,log]}
                                })
                            })
                })
        })
    }
    assembleToResponse(incidente){
        return {
            id:incidente.id,
            code:incidente.code,
            category:incidente.categoria,
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
            }
        }
    }
    validateDTO(dto){
        const errors = {}
        if(!dto.incidente_code) {
            errors["incidente_code"] = "*Campo obligatorio"
        }

        if (Object.keys(errors).length > 0)
            throw new Error("Invalid Form",errors)
    }
}