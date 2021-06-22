import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class GetAllCategory {
    
    async run(){
        return (await this.getAll()).map(this.assembleToResponse)
    }

    getAll(){
        return Model.Categoria.findAll({
            include:[
               {model:Model.Prioridad, as:'prioridad'}
               
            ]
        })
    }

    assembleToResponse(categoria){
        return {
            servicio:categoria.servicio,
            categoria:categoria.categoria,
            subcategoria:categoria.subcategoria,
            prioridad:categoria.prioridad,
            fechaCreacion:new DateHelper(categoria.createdAt).toString()
        }
    }
}