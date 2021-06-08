import {Model,DataTypes} from "sequelize"
import {ROLS,PRIORITY} from "@/share/constants"
import DateHelper from "@/share/timeHelpers"

export default class UserLog extends Model {}

export function init(connection){
    UserLog.init({
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
        modelName: 'user_logs',
        sequelize: connection
    })
}