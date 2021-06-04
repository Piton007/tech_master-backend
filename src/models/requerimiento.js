import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants" 

export default class Requerimiento extends Model {}

export function init(connection){
    Requerimiento.init({
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
        fechaAsignacion:{
            type:DataTypes.DATE
        },
        fechaCierre:{
            type:DataTypes.DATE
        }
        
    },{
        modelName: 'requerimiento',
        sequelize: connection
    })
    
}