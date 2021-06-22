import Model from "@/models"
import {connection} from "@/db.manager.js"


export default class AddCategory {
    async run(dto){
        this.validateDTO(dto)
        const category = await this.create(dto)
        return {
            id:category.id,
            servicio:category.servicio,
            categoria:category.categoria,
            subcategoria:category.subcategoria,
            prioridad_id:category.prioridad_id,
            prioridad:category.prioridad
        }

    }

    create(dto){
        return connection.transaction(t=>{
            return Model.Categoria.findAll({
                where:{
                    servicio:dto.service,
                    categoria:dto.category,
                    subcategoria:dto.subCategory
                },
                transaction:t
            }).then(unique=>{
                if (!!unique.length)
                    throw new Error(JSON.stringify({msg:"Error al crear categoría",errors:{categoria:"Ya existe una categoría con estos datos"}}))
                return Model.Categoria.create({
                        servicio:dto.service,
                        categoria:dto.category,
                        subcategoria:dto.subCategory,
                        prioridad_id:dto.priority_id
                    },{transaction:t}).then(x=>{
                        const {dataValues:category} = x
                        return Model.Prioridad.findByPk(category.prioridad_id,{transaction:t}).then(p=>{
                            return {
                                ...category,
                                prioridad:p
                            }
                        })
                    })  
            })
        })
        
    }

 

    validateDTO(dto){
        const errors = {}
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