import {connection} from "@/db.manager.js"
import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class ResolveIncidenteService {
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        const incidente = await this.resolve(dto)
        return this.assembleToResponse(incidente)
    }

    resolve(dto){
        return connection.transaction(t=>{
            return Model.Incidente.update({
                status:"resolved"
            },{where:[{code:dto.incidente_code}],transaction:t})
            .then((update)=>{
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
                        comment: `
                        ${incidente.supervisedByIncident.firstName} con email: ${incidente.supervisedByIncident.email} ha resuelto el incidente
                        ${dto.comment}
                        `,
                        status:"resolved",
                        tipo: 'incidente',
                        event: `${incidente.supervisedByIncident.firstName} ha resuelto el incidente`,
                        incidente_id:incidente.id
                    },{transaction:t}).then((log)=>{
                    return {...incidente,logs:[...incidente.logs,log.dataValues]}
                })
            })
        })   
        })
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.incidente_code)
            errors["incidente_code"] = dto.incidente_code
        if(!dto.comment)
            errors["comment"] = dto.comment
        if(Object.keys(errors).length > 0)
            throw new Error({msg:"Invalid Form",errors})
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