import User,{init as userInit} from "./user"
import Category,{init as categoryInit} from "./category"
import Requerimiento,{init as requerimientoInit} from "./requerimiento"
import Logs, {init as logsInit} from "./logs" 


export default {
    User,
    Category,
    Requerimiento,
    Logs
}

export function init(connection){
    userInit(connection)
    categoryInit(connection)
    requerimientoInit(connection)
    logsInit(connection)
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
}
