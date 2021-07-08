import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class GetAllIncidentes {
    constructor(){

    }

    async run (dto){
        if (!(["admin","tech","tech_2"].some(x=> x === dto.auth.rol)))
            return (await this._getByUserId(dto.auth.id)).map(this.assembleToResponse)
        return (await this._getAll()).map(this.assembleToResponse)
    }

    async _getAll(){
        return (await Model.Incidente.findAll({
            include:[
                {model:Model.User,as:"requestedBy"},
                {model:Model.User, as: "supervisedByIncident"},
                {model:Model.User,as:'affectedBy'},
                {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                {model:Model.IncidenteLogs,as:"logs"}
            ]
        }))
    }

    async _getByUserId(id){
        return await Model.Incidente.findAll({
            where :{
                usuario_solicitante_id: id
            },
            include:[
                {model:Model.User,as:"requestedBy"},
                {model:Model.User, as: "supervisedByIncident"},
                {model:Model.User,as:'affectedBy'},
                {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
                {model:Model.IncidenteLogs,as:"logs"}
                ]
        })
    }

    assembleToResponse(incidente){
        return {
            id:incidente.id,
            code:incidente.code,
            documents:(!incidente.document_urns) ? [] : incidente.document_urns.split(";"),
            description:incidente.description,
            status: incidente.status,
            fechaCierre: (!incidente.fechaCierre)? incidente.fechaCierre : new DateHelper(incidente.fechaCierre).toString(),
            fechaAsignacion:(!incidente.fechaAsignacion)? incidente.fechaAsignacion : new DateHelper(incidente.fechaAsignacion).toString(),
            fechaCreacion: new DateHelper(incidente.createdAt).toString(),
            category:incidente.categoria,
            creator: {
                rol:incidente.requestedBy.rol,
                dni:incidente.requestedBy.dni,
                firstName: incidente.requestedBy.firstName,
                lastName: incidente.requestedBy.lastName,
                priority: incidente.requestedBy.priority
            },
            affected:{
                rol:incidente.affectedBy.rol,
                dni:incidente.affectedBy.dni,
                firstName: incidente.affectedBy.firstName,
                lastName: incidente.affectedBy.lastName,
                priority: incidente.affectedBy.priority
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

        }
    }
 }