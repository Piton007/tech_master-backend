import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants"


export default class Logs extends Model {}

export function init(connection){
    Logs.init({
        comment: {
            type: DataTypes.STRING,
        },
        event:{
            type: DataTypes.STRING
        },
        tipo:{
            type: DataTypes.STRING,
            values:["incidente","requerimiento"]
        },
        status: {
            type: DataTypes.STRING,
            values:[...TASK_STATUS]
        },
        
    },{
        modelName: 'logs',
        sequelize: connection
    })
}