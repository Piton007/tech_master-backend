import Model from "@/models"
import {connection} from "@/db.manager.js"
import DateHelper from "@/share/timeHelpers"


export default class AddCommentRequerimiento {

    
    async run(dto){
        const requerimiento = await this.addComment(dto)
        return this.assembleToResponse(requerimiento)
    }

    addComment(dto){
        return connection.transaction(t=>{
            return Model.Requerimiento.findAll(
            {
                where:{code:dto.requerimiento_code},
                transaction:t,
                include:[
                    {model:Model.User,as:"reportedBy"},
                    {model:Model.User, as: "supervisedBy"},
                    Model.Logs
                ]
            }
            ).then(req=>{
                return Model.User.findAll(
                    {where:{id:dto.user_id},
                    transaction:t}
                    ).then(_user=>{
                        const [{dataValues:requerimiento}] = req
                        const [{dataValues:user}] = _user
                        return Model.Logs.create({
                            comment:`
                            ${user.firstName} con email: ${user.email} y dni ${user.dni} 
                            ${dto.comment}`,
                            status:"comment",
                            tipo:"requerimiento",
                            requerimiento_id:requerimiento.id,
                            event:`${user.firstName} ha comentado`,
                        },{transaction:t}).then(log => {
                            return {...requerimiento,logs:[...requerimiento.logs,log.dataValues]}
                        }).catch(error=>{
                            console.log(error)
                            return requerimiento
                        })
                    })
            }) 
        })
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.requerimiento_code)
            errors["requerimiento_code"] = dto.requerimiento_code
        if(!dto.comment)
            errors["comment"] = dto.comment
        if(!dto.user_id)
            errors["user_id"] = dto.user_id
        if(Object.keys(errors).length > 0)
            throw new Error({msg:"Invalid Form",errors})
    }

    assembleToResponse(requerimiento){
        return {
            id:requerimiento.id,
            code:requerimiento.code,
            categories:requerimiento.categories.split(";"),
            description:requerimiento.description,
            status: requerimiento.status,
            fechaCierre: (!requerimiento.fechaCierre)? requerimiento.fechaCierre : new DateHelper(requerimiento.fechaCierre).toString(),
            fechaAsignacion:(!requerimiento.fechaAsignacion)? requerimiento.fechaAsignacion : new DateHelper(requerimiento.fechaAsignacion).toString(),
            fechaCreacion: new DateHelper(requerimiento.createdAt).toString(),
            creator: {
                rol:requerimiento.reportedBy.rol,
                dni:requerimiento.reportedBy.dni,
                firstName: requerimiento.reportedBy.firstName,
                lastName: requerimiento.reportedBy.lastName,
                priority: requerimiento.reportedBy.priority
            },
            logs:requerimiento.logs.map(x=>({status:x.status,event:x.event,tipo:x.tipo,comment:x.comment,fechaCreacion: new DateHelper(x.createdAt).toString()})),
            supervisedBy: {
                id:requerimiento.supervisedBy.id,
                email:requerimiento.supervisedBy.email,
                rol:requerimiento.supervisedBy.rol,
                dni:requerimiento.supervisedBy.dni,
                firstName: requerimiento.supervisedBy.firstName,
                lastName: requerimiento.supervisedBy.lastName,
                priority: requerimiento.supervisedBy.priority
            } 
        }
    }
}