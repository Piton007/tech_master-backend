import User,{init as userInit} from "./user"
import Category,{init as categoryInit} from "./category"
import Incident,{init as incidentInit} from "./incident"
import Logs, {init as logsInit} from "./logs" 


export default {
    User,
    Category,
    Incident,
    Logs
}

export function init(connection){
    userInit(connection)
    categoryInit(connection)
    incidentInit(connection)
    logsInit(connection)
    associations()
}
function associations (){
    User.hasMany(Incident)
    Incident.belongsTo(User,{
        foreignKey:'user_id'
    }) 
}