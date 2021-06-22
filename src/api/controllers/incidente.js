import {all,onlyAdmin,onlyClient,onlyTech} from "@/api/middleware/auth"
import {Router} from "express"
import GetAllIncidenteService from "@/services/incidente/get.all.js"
import CreateIncidenteService from "@/services/incidente/create.js"
import AssignIncidenteService from "@/services/incidente/assign.js"
import ResolveIncidenteService from "@/services/incidente/resolve.js"
import VerifyIncidenteService from "@/services/incidente/verify.js"
import AddCommentService from "@/services/incidente/add.comment.js"

export default function (){
    const getAllIncidentes = new GetAllIncidenteService()
    const createIncidente = new CreateIncidenteService()
    const assignIncidente = new AssignIncidenteService()
    const resolveIncidenteService = new ResolveIncidenteService()
    const verifyIncidente = new VerifyIncidenteService()
    const addComment = new AddCommentService()

    const router = new Router()
    router.get("/",all,async (req,res)=>{
        try {

            const response = await getAllIncidentes.run(req.body)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
       
    })

    router.post("/",all,async(req,res)=>{
        const dto = req.body
        try {
            const response = await createIncidente.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })
    router.post("/asignar",onlyTech,async(req,res)=>{
        const dto = req.body
        try {
            const response = await assignIncidente.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })

    router.post("/resolver",onlyTech,async(req,res)=>{
        const dto = req.body
        try {
            const response = await resolveIncidenteService.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })


    router.post("/verify",all,async(req,res)=>{
        const dto = req.body
        try {
            const response = await verifyIncidente.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })

    router.post("/comment",all,async(req,res)=>{
        const dto = req.body
        try {
            const response = await addComment.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })


    return router
}