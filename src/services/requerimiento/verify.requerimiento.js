import {connection} from "@/db.manager"
import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class VerifyRequerimientoService{
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        const requerimiento = await this.update(dto)
        return this.assembleToResponse(requerimiento)
    }

    update(dto){
        let self = this
        return connection.transaction(t=>{
            const newStatus = self.getNewStatus(dto)
            return Model.Requerimiento.update(
                {
                status:newStatus.status,
                fechaCierre:newStatus.date
                },
                {where:[{code:dto.requerimiento_code}],transaction:t}
            ).then((update)=>{
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
                        tipo: 'requerimiento',
                        status:newStatus.status,
                        event: `${requerimiento.reportedBy.firstName} ${(newStatus.status==='closed') ? 'ha aceptado la resolución' : 'ha rechazado la resolución'}`,
                        requerimiento_id:requerimiento.id
                    },{transaction:t}).then((log)=>{
                    return {...requerimiento,logs:[...requerimiento.logs,log.dataValues]}
                })
            })
        })  
        })
    }

    getNewStatus(dto){
        return (dto.result === "accept") ? {status:"closed",date:DateHelper.now().value(),event:"El requerimiento se ha cerrado"} : {status:"in_process",event:"El requerimientoe ha sido rechazado"}
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.requerimiento_code)
            errors["requerimiento_code"] = "*Campo obligatorio"
        if(!dto.comment)
            errors["comment"] = "*Campo obligatorio"
        if(!(["rejected","accept"].some(x=>x === dto.result)))
            errors["result"] = "*Campo obligatorio"
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