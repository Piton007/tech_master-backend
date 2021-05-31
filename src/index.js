import 'module-alias/register'
import {config} from "dotenv"
import DBManager from "@/db.manager"
import API from "@/api"



config()

const dbConfig = {
    user: process.env.USER_DB,
    pass: process.env.PASS_DB,
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    db: process.env.DB_NAME
}

const dbmanager =  new DBManager(dbConfig)

async function main(){
    await dbmanager.init()
    await new API(process.env.API_PORT).init()
}

try {
    main()
} catch (error) {
    console.log(error)
}




