import {Sequelize} from "sequelize";
import {init as migrate} from "@/models"

export let connection 

export default class DBManager {
    constructor(config){
        this.sequelize = new Sequelize(process.env.DB_STRING,{
            dialect:'postgres',
            dialectOptions:{
                ssl:{
                    require:true,
                    rejectUnauthorized: false
                }
            }
        })
        connection = this.sequelize
    }

    async init(){
        try {
        await this.authenticate()
        migrate(this.sequelize)
        await this.sync()
        } catch (error) {
        console.error('Unable to connect to the database:', error);
     }   
    }
    async authenticate(){
       
            await this.sequelize.authenticate()
            console.log("DB",'Connection has been established successfully.');
        
    }
    async sync(){
        await this.sequelize.sync()
    }
}