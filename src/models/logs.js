import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants"


export default class Logs extends Model {}

export function init(connection){
    Logs.init({
        comment: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
            values:[...TASK_STATUS]
        },
        created_at:{
            type: DataTypes.STRING
        },
        categoria_3: {
            type:DataTypes.STRING,
        },
        tipo:{
            type: DataTypes.STRING,
            values:["incidente","requerimiento"]
        }
        
    },{
        modelName: 'logs',
        sequelize: connection
    })
}