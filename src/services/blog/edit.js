import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class EditBlog {
    async run(dto){
        this.validateDTO(dto)
        const [_,[{dataValues:blog}]] = await this.edit(dto)
        return {
            id:blog.id,
            title: blog.title,
            content:blog.content,
            fechaActualizacion:new DateHelper(blog.updatedAt).toString()
        }

    }

    edit(dto){
        return Model.Blog.update(
            {
                
                title:dto.title,
                content:dto.content,
                updatedAt:DateHelper.now().value()
            },
            {returning: true,where:[{id:dto.id}]}
        )
        
    }

 

    validateDTO(dto){
        const errors = {}
        if(!dto.id)
            errors["id"] = "El identificador es obligatorio"
        if(!dto.title)
            errors["titulo"] = "El titulo es obligatorio"
        if(!dto.content)
            errors["contenido"] = "El contenido es obligatorio"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Error al crear un blog",errors}))
    }
}