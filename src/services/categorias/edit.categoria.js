import Model from "@/models"
import {connection} from "@/db.manager.js"


export default class UpdateCategory {
    async run(dto){
        this.validateDTO(dto)
        const category = await this.update(dto)
        return {
            id:category.id,
            servicio:category.servicio,
            categoria:category.categoria,
            subcategoria:category.subcategoria,
            prioridad_id:category.prioridad_id,
            prioridad:category.prioridad
        }

    }
    update(dto){
        return connection.transaction(t=>{
            return Model.Categoria.update(
                {
                    servicio:dto.service,
                    categoria:dto.category,
                    subcategoria:dto.subCategory,
                    prioridad:dto.priority_id
                },
            {returning: true,where:[{id:dto.category_id}],transaction:t}
            ).then(([rowsUpdated,[x]])=>{
            const {dataValues:category} = x
            return Model.Prioridad.findByPk(category.prioridad_id,{transaction:t}).then(p=>{
                return {
                    ...category,
                    prioridad:p
                }
            })
        }) 
        
      
})}


    validateDTO(dto){
        const errors = {}
        if(!dto.category_id){
            errors["category_id"] = "El identificador es obligatorio"
        }
        if(!dto.service)
            errors["service"] = "El servicio es obligatorio"
        if(!dto.category)
            errors["category"] = "La categoría es obligatoria"
        if(!dto.priority_id)
            errors["prioridad"] = "La prioridad es obligatoria"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Error al crear categoría",errors}))
    }
}