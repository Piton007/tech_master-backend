import Model from "@/models"


export default class RemoveBlog {
    async run(dto){
        this.validateDTO(dto)
        const blog = await this.delete(dto)
        return {
            id:blog.id
        }

    }

    delete(dto){
        return Model.Blog.destroy({
            where:{
                id:dto.blog_id
            }
        })
        
    }

 

    validateDTO(dto){
        const errors = {}
        if(!dto.blog_id)
            errors["id"] = "El identificador es obligatorio"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Error al crear un blog",errors}))
    }
}