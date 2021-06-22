import Model from "@/models"

export default class GetAllPriority {
    async run(){
        return await this.getAll()
    }

    getAll(){
        return Model.Prioridad.findAll()
    }
}