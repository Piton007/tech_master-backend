import {connection} from "@/db.manager"
import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class VerifyIncidenteService{
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        const incidente = await this.update(dto)
        return this.assembleToResponse(incidente)
    }

    update(dto){
        let self = this
        return connection.transaction(t=>{
            const newStatus = self.getNewStatus(dto)
            return Model.Incidente.update(
                {
                status:newStatus.status,
                fechaCierre:newStatus.date
                },
                {where:[{code:dto.incidente_code}],transaction:t}
            ).then((update)=>{
                return Model.Incidente.findAll({
                    where:{code:dto.incidente_code},
                    transaction:t,
                    include:[
                        {model:Model.User,as:"requestedBy"},
                        {model:Model.User, as: "supervisedByIncident"},
                        {model:Model.User,as:'affectedBy'},
                        {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                                                    {model:Model.IncidenteLogs,as:"logs"}
                    ]
                }).then((incidentes)=>{
                    const [{dataValues:incidente}] = incidentes
                    return Model.IncidenteLogs.create({
                        comment: 
                        `${incidente.requestedBy.firstName} 
                        con email: ${incidente.requestedBy.email}
                        ${dto.comment}`,
                        tipo: 'incidente',
                        status:newStatus.status,
                        event: `${incidente.requestedBy.firstName}  ${(newStatus.status==='closed') ? 'ha aceptado la resolución' : 'ha rechazado la resolución'}`,
                        incidente_id:incidente.id
                    },{transaction:t}).then((log)=>{
                    return {...incidente,logs:[...incidente.logs,log.dataValues]}
                })
            })
        })  
        })
    }

    getNewStatus(dto){
        return (dto.result === "accept") ? {status:"closed",date:DateHelper.now().value(),event:"El incidente se ha cerrado"} : {status:"in_process",event:"El incidente ha sido rechazado"}
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.incidente_code)
            errors["incidente_code"] = "*Campo obligatorio"
        if(!dto.comment)
            errors["comment"] = "*Campo obligatorio"
        if(!(["rejected","accept"].some(x=>x === dto.result)))
            errors["result"] = "*Campo obligatorio"
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
} 