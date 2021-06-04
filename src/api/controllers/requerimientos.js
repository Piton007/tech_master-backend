import {all,onlyAdmin,onlyClient,onlyTech} from "@/api/middleware/auth"
import {Router} from "express"
import GetAllRequerimientoService from "@/services/requerimiento/get.all.js"
import CreateRequerimientoService from "@/services/requerimiento/create.requerimiento.js"
import AssignRequerimientoService from "@/services/requerimiento/assign.requerimiento.js"
import ResolveRequerimientoService from "@/services/requerimiento/resolve.requerimiento.js"
import VerifyRequerimientoService from "@/services/requerimiento/verify.requerimiento.js"


export default function (){
    const getAllRequerimientos = new GetAllRequerimientoService()
    const createRequerimiento = new CreateRequerimientoService()
    const assignRequerimiento = new AssignRequerimientoService()
    const resolveRequerimientoService = new ResolveRequerimientoService()
    const verifyRequerimiento = new VerifyRequerimientoService()

    const router = new Router()
    router.get("/",all,async (req,res)=>{
        try {

            const response = await getAllRequerimientos.run(req.body)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
       
    })

    router.post("/",all,async(req,res)=>{
        const dto = req.body
        try {
            const response = await createRequerimiento.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })
    router.post("/asignar",onlyTech,async(req,res)=>{
        const dto = req.body
        try {
            const response = await assignRequerimiento.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })

    router.post("/resolver",onlyTech,async(req,res)=>{
        const dto = req.body
        try {
            const response = await resolveRequerimientoService.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })


    router.post("/verify",all,async(req,res)=>{
        const dto = req.body
        try {
            const response = await verifyRequerimiento.run(dto)
            res.status(200).send({data:response})
        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })


    return router
}