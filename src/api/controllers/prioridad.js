import GetAllPrioridad from "@/services/prioridad/get.all.js"
import {all} from "@/api/middleware/auth"
import {Router} from "express"



export default function (){
    const getAllService = new GetAllPrioridad()
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
    return router
}