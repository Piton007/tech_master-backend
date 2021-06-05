import User,{init as userInit} from "./user"
import Category,{init as categoryInit} from "./category"
import Requerimiento,{init as requerimientoInit} from "./requerimiento"
import Logs, {init as logsInit} from "./logs"
import UserLogs, {init as userLogsInit} from "./user.log" 



export default {
    User,
    Category,
    Requerimiento,
    Logs,
    UserLogs
}

export function init(connection){
    userInit(connection)
    categoryInit(connection)
    requerimientoInit(connection)
    logsInit(connection)
    userLogsInit(connection)
    associations()
}
function associations (){
    
    Requerimiento.belongsTo(User,{foreignKey:"user_id",as:"reportedBy"}) 
    User.hasMany(Requerimiento,{
        foreignKey: "user_id",as:"reportedBy"
    })

    Requerimiento.belongsTo(User,{foreignKey:"supervisor_id",as:"supervisedBy"}) 
    User.hasMany(Requerimiento,{
        foreignKey: "supervisor_id",as:"supervisedBy"
    })

    Requerimiento.hasMany(Logs,{foreignKey:"requerimiento_id"})
    Logs.belongsTo(Requerimiento,{foreignKey:"requerimiento_id"})

    User.hasOne(UserLogs,{foreignKey:"user_id",as:"log"})
    UserLogs.belongsTo(User,{foreignKey:"user_id",as:"user"})

    UserLogs.belongsTo(Requerimiento,{foreignKey:"requerimiento_id",as:"requerimiento"})
    Requerimiento.hasOne(UserLogs,{foreignKey:"requerimiento_id",as:"user_log"})
}
