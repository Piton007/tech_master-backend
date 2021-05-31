import Model from "@/models"

export default class GetAllIncidents {
    constructor(){

    }

    async run({auth:{rol}}){
        if (!(["teacher","volunteer"].some(x=>x === rol)))
            return (await this._getAll()).map(assembleToResponse)
        return (await this._getByUserId(id)).map(assembleToResponse)
    }

    async _getAll(){
        return (await Model.Incident.findAll({
            attributes:["code","categories","description","status","created_at"]
        }))
    }

    async _getByUserId(id){
        return await Model.Incident.findAll({
            attributes:["code","categories","description","status","created_at","user_id"],
            where :{
                user_id: id
            }
        })
    }

    assembleToResponse(incident){
        return {
            code:incident.code,
            categories: incident.categories.split(";"),
            description:incident.description,
            status: incident.status,
            created_at: incident.created_at
        }
    }
 }