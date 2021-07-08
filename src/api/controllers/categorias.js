import AddCategoryService from "@/services/categorias/add.categoria.js"
import GetAllCategoryService from "@/services/categorias/get.all.js"
import UpdateCategoryService from "@/services/categorias/edit.categoria.js"
import {all} from "@/api/middleware/auth"
import {Router} from "express"



export default function (){
    const addService = new AddCategoryService()
    const getAllService = new GetAllCategoryService()
    const updateService = new UpdateCategoryService()
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

    router.post("/",all,async (req,res)=>{
       
        try {
        const dto = req.body
        const response = await addService.run(dto)
        return res.status(201).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })

    router.put("/",all,async (req,res)=>{
       
        try {
        const dto = req.body
        const response = await updateService.run(dto)
        return res.status(201).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })

    return router
}