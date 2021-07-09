import Model from "@/models"
import DateHelper from "@/share/timeHelpers"


export default class GetAllBlog {
    
    async run(){
        return (await this.getAll()).map(this.assembleToResponse)
    }

    getAll(){
        return Model.Blog.findAll()
    }

    assembleToResponse(blog){
        return {
            id:blog.id,
            title:blog.title,
            content:blog.content,
            fechaCreacion:new DateHelper(blog.updatedAt).toString()
        }
    }
}