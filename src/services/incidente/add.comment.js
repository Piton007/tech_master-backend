import Model from "@/models"
import {connection} from "@/db.manager.js"
import DateHelper from "@/share/timeHelpers"


export default class AddCommentIncidente {

    
    async run(dto){
        const incidente = await this.addComment(dto)
        return this.assembleToResponse(incidente)
    }

    addComment(dto){
        return connection.transaction(t=>{
            return Model.Incidente.findAll(
            {
                where:{code:dto.incidente_code},
                transaction:t,
                include:[
                    {model:Model.User,as:"requestedBy"},
                    {model:Model.User, as: "supervisedByIncident"},
                    {model:Model.User,as:'affectedBy'},
                    {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                    {model:Model.IncidenteLogs,as:"logs"}
                ]
            }
            ).then(req=>{
                return Model.User.findAll(
                    {where:{id:dto.user_id},
                    transaction:t}
                    ).then(_user=>{
                        const [{dataValues:incidente}] = req
                        const [{dataValues:user}] = _user
                        return Model.IncidenteLogs.create({
                            comment:`
                            ${user.firstName} con email: ${user.email} y dni ${user.dni} 
                            ${dto.comment}`,
                            status:"comment",
                            tipo:"incidente",
                            incidente_id:incidente.id,
                            event:`${user.firstName} ha comentado`,
                        },{transaction:t}).then(log => {
                            return {...incidente,logs:[...incidente.logs,log.dataValues]}
                        }).catch(error=>{
                            console.log(error)
                            return incidente
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
        if(!dto.user_id)
            errors["user_id"] = dto.user_id
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