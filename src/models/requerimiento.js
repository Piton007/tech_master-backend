import {Model,DataTypes} from "sequelize"
import {TASK_STATUS} from "@/share/constants" 
import DateHelper from "@/share/timeHelpers"

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
        modelName: 'requerimiento',
        sequelize: connection
    })
    
}