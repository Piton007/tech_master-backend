import Model from "@/models"


export default class EditBlog {
    async run(dto){
        this.validateDTO(dto)
        const blog = await this.edit(dto)
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
            {returning: true,where:[{id:dto.blog_id}]}
        )
        
    }

 

    validateDTO(dto){
        const errors = {}
        if(!dto.blog_id)
            errors["id"] = "El identificador es obligatorio"
        if(!dto.title)
            errors["titulo"] = "El titulo es obligatorio"
        if(!dto.content)
            errors["contenido"] = "El contenido es obligatorio"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Error al crear un blog",errors}))
    }
}