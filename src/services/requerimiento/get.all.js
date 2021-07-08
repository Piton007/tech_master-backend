import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class GetAllRequerimientos {
    constructor(){

    }

    async run (dto){
        if (!(["admin","tech","tech_2"].some(x=> x === dto.auth.rol)))
            return (await this._getByUserId(dto.auth.id)).map(this.assembleToResponse)
        return (await this._getAll()).map(this.assembleToResponse)
    }

    async _getAll(){
        return (await Model.Requerimiento.findAll({
            include:[
            {model:Model.User,as:"reportedBy"},
            {model:Model.User, as: "supervisedBy"},
            Model.Logs
            ]
        }))
    }

    async _getByUserId(id){
        return await Model.Requerimiento.findAll({
            where :{
                user_id: id
            },
            include:[
                {model:Model.User,as:"reportedBy"},
                {model:Model.User, as: "supervisedBy"},
                Model.Logs
                ]
        })
    }

    assembleToResponse(requerimiento){
        return {
            id:requerimiento.id,
            code:requerimiento.code,
            documents:(!requerimiento.document_urns) ? [] : requerimiento.document_urns.split(";"),
            categories: requerimiento.categories.split(";"),
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
            supervisedBy: (!!requerimiento.supervisedBy) ?  {
                id:requerimiento.supervisedBy.id,
                rol:requerimiento.supervisedBy.rol,
                email:requerimiento.supervisedBy.email,
                dni:requerimiento.supervisedBy.dni,
                firstName: requerimiento.supervisedBy.firstName,
                lastName: requerimiento.supervisedBy.lastName,
                priority: requerimiento.supervisedBy.priority
            } : requerimiento.supervisedBy

        }
    }
 }