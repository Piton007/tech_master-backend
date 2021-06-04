import CreateUserService from "@/services/user/create.user.js"
import LoginUserService from "@/services/user/login.user.js"
import GetAllUserService from "@/services/user/get.all.user.js"
import {all,onlyAdmin} from "@/api/middleware/auth"
import {Router} from "express"



export default function (){
    const createService = new CreateUserService()
    const loginService = new LoginUserService()
    const getAllService = new GetAllUserService()
    const router = new Router()

    router.get("/",onlyAdmin,async (req,res) => {
        try {

            const response = await getAllService.run(req.body.auth)
            return res.status(200).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }
    })

    router.post("/root",async (req,res)=>{
       
        try {
        const dto = req.body
        dto.auth = {
            rol:"admin"
        }
        dto.rol = "admin"
        const response = await createService.run(dto)
        return res.status(201).send(response)
        } catch (error) {
            console.log(error)
            return res.status(500).send(error.message)
        }

    })

    router.post("/",onlyAdmin,async (req,res)=>{
        const dto = req.body
        try {
            const response = await createService.run(dto)
            res.status(201).send(response)
        } catch (error) {
            res.status(500).send(error.message)
        }
    })

    router.post("/login",async (req,res)=>{
        const dto = req.body
        try {
            const response = await loginService.run(dto)
            res.status(200).send(response)
        } catch (error) {
            res.status(500).send(error.message)
        }
    })



    return router
}