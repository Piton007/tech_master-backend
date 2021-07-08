import 'module-alias/register'
import {config} from "dotenv"
import updateBatch from "@/batchs/update.incidentes.js"
import DBManager from "@/db.manager"
import API from "@/api"



config()

const dbmanager =  new DBManager()

async function main(){
    await dbmanager.init()
    await new API(process.env.PORT || 3500).init()
    await updateBatch()
    setInterval(async function(){
        await updateBatch()
    },24 * 60 * 60 * 1000)
    
}

try {
    main()
} catch (error) {
    console.log(error)
}




