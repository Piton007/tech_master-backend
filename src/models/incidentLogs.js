import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants"
import DateHelper from "@/share/timeHelpers"


export default class IncidentLogs extends Model {}

export function init(connection){
    IncidentLogs.init({
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
        createdAt:{
            type:DataTypes.DATE,
            set(){
                this.setDataValue("createdAt",DateHelper.now().value()) 
            }
        },
        updatedAt:{
            type:DataTypes.DATE,
            set(){
                this.setDataValue('updatedAt',DateHelper.now().value())
            }
        }
        
    },{
        modelName: 'incident_logs',
        sequelize: connection
    })
}