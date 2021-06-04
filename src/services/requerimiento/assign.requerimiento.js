import {connection} from "@/db.manager"
import Model from "@/models"
import dayjs from "dayjs"

export default class AssignRequerimientoService{
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        try {
            const requerimiento =  await this.assign(dto)
            return this.assembleToResponse(requerimiento)
            
        } catch (error) {
            console.log(error)
            throw new Error({msg:"Error during assign"},{requerimiento:"no assigned"})
        }
       
    }


    async assign(dto){
        return connection.transaction(t=>{
            return Model.Requerimiento.update(
                {
                supervisor_id: dto.user_id,
                status:"in_process", 
                fechaAsignacion: new Date()
                },
                {where: [{code:dto.requerimiento_code}],transaction:t})
                .then((x)=>{
                    return Model.Requerimiento.findAll(
                        {where:{code:dto.requerimiento_code},
                        transaction:t,
                        include:[
                            {model:Model.User,as:"reportedBy"},
                            {model:Model.User, as: "supervisedBy"},
                            Model.Logs
                            ]}).then(y=>{
                                const [{dataValues:requerimiento}] = y
                                return Model.Logs.create({
                                    requerimiento_id:requerimiento.id,
                                    event:"Cambio de estado a En curso",
                                    comment:`El Requerimientoe ha sido asignado a ${requerimiento.supervisedBy.firstName} con email: ${requerimiento.supervisedBy.email}`,
                                    tipo:"requerimiento",
                                    status:"in_process"
                                },{transaction:t}).then((log)=>{
                                    return {...requerimiento,logs:[...requerimiento.logs,log]}
                                })
                            })
                })
        })
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
    validateDTO(dto){
        const errors = {}
        if(!dto.requerimiento_code) {
            errors["requerimiento_code"] = "*Campo obligatorio"
        }

        if (Object.keys(errors).length > 0)
            throw new Error("Invalid Form")
    }
}