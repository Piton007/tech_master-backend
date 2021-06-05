import 'module-alias/register'
import {config} from "dotenv"
import DBManager from "@/db.manager"
import API from "@/api"



config()

const dbmanager =  new DBManager()

async function main(){
    await dbmanager.init()
    await new API(process.env.API_PORT).init()
}

try {
    main()
} catch (error) {
    console.log(error)
}




