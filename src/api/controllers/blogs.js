import AddBlogService from "@/services/blog/add.js"
import GetAllBlogService from "@/services/blog/get.all.js"
import DeleteBlogService from "@/services/blog/delete"
import UpdateBlogService from "@/services/blog/edit.js"
import {all,onlyAdmin} from "@/api/middleware/auth"
import {Router} from "express"



export default function (){
    const addService = new AddBlogService()
    const getAllService = new GetAllBlogService()
    const updateService = new UpdateBlogService()
    const deleteService = new DeleteBlogService()
    const router = new Router()

    router.get("/",all,async (req,res) => {
        try {
            const response = await getAllService.run()
            return res.status(200).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    })

    router.post("/",onlyAdmin,async (req,res)=>{
       
        try {
        const dto = req.body
        const response = await addService.run(dto)
        return res.status(201).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })

    router.put("/",onlyAdmin,async (req,res)=>{
       
        try {
        const dto = req.body
        const response = await updateService.run(dto)
        return res.status(200).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })
    router.delete("/",onlyAdmin,async (req,res)=>{
       
        try {
        const dto = req.body
        const response = await deleteService.run(dto)
        return res.status(200).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })

    return router
}