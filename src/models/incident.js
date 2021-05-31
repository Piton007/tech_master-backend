import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants" 
import User from "./user"

export default class Incident extends Model {}

export function init(connection){
    Incident.init({
        code:{
            type: DataTypes.STRING
        },
        categories: {
            type: DataTypes.STRING
        },
        description:{
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.STRING,
            values:[...TASK_STATUS]
        },
        document_urns: {
            type:DataTypes.TEXT
        },
        created_at: {
            type: DataTypes.STRING
        }
        
    },{
        modelName: 'incident',
        sequelize: connection
    })
    
}