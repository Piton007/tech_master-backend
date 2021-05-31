import auth from "@/api/middleware/auth"
import {Router} from "express"
import GetAllIncidentService from "@/services/incident/get.all.js"



export default function (){
    const getAllIncidents = new GetAllIncidentService()
    const router = new Router()
    router.get("/",auth,async (req,res)=>{
        const dto = req.body
        try {
            const response = await getAllIncidents.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            res.status(500).send(error)
        }
       
    })


    return router
}