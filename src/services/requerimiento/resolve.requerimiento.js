import {connection} from "@/db.manager.js"
import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class ResolveRequerimientoService {
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        const requerimiento = await this.resolve(dto)
        return this.assembleToResponse(requerimiento)
    }

    resolve(dto){
        return connection.transaction(t=>{
            return Model.Requerimiento.update({
                status:"resolved"
            },{where:[{code:dto.requerimiento_code}],transaction:t})
            .then((update)=>{
                return Model.Requerimiento.findAll({
                    where:{code:dto.requerimiento_code},
                    transaction:t,
                    include:[
                        {model:Model.User,as:"reportedBy"},
                        {model:Model.User, as: "supervisedBy"},
                        Model.Logs
                    ]
                }).then((requerimientos)=>{
                    const [{dataValues:requerimiento}] = requerimientos
                    return Model.Logs.create({
                        comment: dto.comment,
                        status:"resolved",
                        tipo: 'requerimiento',
                        event: `${requerimiento.supervisedBy.firstName} ha resuelto el requerimiento`,
                        requerimiento_id:requerimiento.id
                    },{transaction:t}).then((log)=>{
                    return {...requerimiento,logs:[...requerimiento.logs,log.dataValues]}
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
        if(Object.keys(errors).length > 0)
            throw new Error({msg:"Invalid Form",errors})
    }

    assembleToResponse(requerimiento){
        return {
            id:requerimiento.id,
            code:requerimiento.code,
            documents:(!requerimiento.document_urns) ? [] : requerimiento.document_urns.split(";"),
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