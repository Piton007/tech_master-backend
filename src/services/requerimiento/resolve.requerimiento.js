import {connection} from "@/db.manager.js"
import Model from "@/models"
import dayjs from "dayjs"

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
                        tipo: 'Requerimientoe',
                        event: 'Cambio de estado a resuelto',
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
            categories:requerimiento.categories.split(";"),
            description:requerimiento.description,
            status: requerimiento.status,
            fechaCierre: (!requerimiento.fechaCierre)? requerimiento.fechaCierre : dayjs(requerimiento.fechaCierre).format("YYYY/MM/DD HH:mm:ss"),
            fechaAsignacion:(!requerimiento.fechaAsignacion)? requerimiento.fechaAsignacion : dayjs(requerimiento.fechaAsignacion).format("YYYY/MM/DD HH:mm:ss"),
            fechaCreacion: dayjs(requerimiento.createdAt).format("YYYY/MM/DD HH:mm:ss"),
            creator: {
                rol:requerimiento.reportedBy.rol,
                dni:requerimiento.reportedBy.dni,
                firstName: requerimiento.reportedBy.firstName,
                lastName: requerimiento.reportedBy.lastName,
                priority: requerimiento.reportedBy.priority
            },
            logs:requerimiento.logs.map(x=>({status:x.status,event:x.event,tipo:x.tipo,comment:x.comment,fechaCreacion:dayjs(x.createdAt).format("DD/MM/YYYY HH:mm:ss")})),
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