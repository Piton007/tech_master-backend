import {Model,DataTypes} from "sequelize"
import {ROLS,PRIORITY} from "@/share/constants"

export default class UserLog extends Model {}

export function init(connection){
    UserLog.init({
    },{
        modelName: 'user_logs',
        sequelize: connection
    })
}