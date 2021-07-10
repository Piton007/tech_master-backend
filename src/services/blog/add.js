import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class AddBlog {
    async run(dto){
        this.validateDTO(dto)
        const blog = await this.create(dto)
        return {
            id:blog.id,
            title: blog.title,
            content:blog.content,
            fechaActualizacion:new DateHelper(blog.createdAt).toString()
        }

    }

    create(dto){
        return Model.Blog.create({
            title:dto.title,
            content:dto.content
        })
        
    }

 

    validateDTO(dto){
        const errors = {}
        if(!dto.title)
            errors["titulo"] = "El titulo es obligatorio"
        if(!dto.content)
            errors["contenido"] = "El contenido es obligatorio"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Error al crear un blog",errors}))
    }
}