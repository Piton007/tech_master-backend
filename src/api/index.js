import cors from "cors"
import express from "express"
import Controllers from "./controllers"
import http from "http"


export default class API {
    constructor(port){
        this.port = port || 3500
    }

    init(){
        const app = express()
        app.use(cors({origin:"*",credentials:true}))
        app.use(express.json())
        app.use("/api/users",Controllers.userController())
        app.use("/api/incidents",Controllers.incidentController())
        http.createServer(app).listen(this.port,()=>{
            console.log(`HTTP running on ${this.port}`)
        })
    }

}