import CreateUserService from "@/services/user/create.user.js"
import auth from "@/api/middleware/auth"
import {Router} from "express"



export default function (){
    const createService = new CreateUserService()
    const router = new Router()
    router.post("/root",async (req,res)=>{
       
        try {
        const dto = req.body
        dto.rol = "admin"
        const response = await createService.run(dto)
        return res.status(201).send(response)
        } catch (error) {
            return res.status(500).send(error.message)
        }

    })

    router.post("/",auth,async (req,res)=>{
        const dto = req.body
        try {
            const response = await createService.run(dto)
            res.status(201).send(response)
        } catch (error) {
            res.status(500).send(error.message)
        }
    })


    return router
}