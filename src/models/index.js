import User,{init as userInit} from "./user"
import Categoria,{init as categoriaInit} from "./category"
import Requerimiento,{init as requerimientoInit} from "./requerimiento"
import Logs, {init as logsInit} from "./logs"
import UserLogs, {init as userLogsInit} from "./user.log"
import Incidente, {init as incidenteInit} from "./incident"
import Prioridad, {init as prioridadInit} from "./priority"
import IncidenteLogs, {init as incidenteLogsInit} from "./incidentLogs"   



export default {
    User,
    Categoria,
    Requerimiento,
    Logs,
    Prioridad,
    IncidenteLogs,
    UserLogs,
    Incidente
}

export function init(connection){
    userInit(connection)
    categoriaInit(connection)
    requerimientoInit(connection)
    logsInit(connection)
    userLogsInit(connection)
    incidenteInit(connection)
    prioridadInit(connection)
    incidenteLogsInit(connection)
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

    Prioridad.hasMany(Categoria,{foreignKey:"prioridad_id",as:"prioridad"})
    Categoria.belongsTo(Prioridad,{foreignKey:"prioridad_id",as:"prioridad"})


    Categoria.hasMany(Incidente,{foreignKey:"categoria_id"})
    Incidente.belongsTo(Categoria,{foreignKey:"categoria_id",onDelete:'cascade',hooks:true})

    Incidente.hasMany(IncidenteLogs,{foreignKey:"incidente_id",as:"logs"})
    IncidenteLogs.belongsTo(Incidente,{foreignKey:"incidente_id",as:"logs"})

    Incidente.belongsTo(User,{foreignKey:'usuario_afectado_id',as:'affectedBy'})
    User.hasMany(Incidente,{foreignKey:'usuario_afectado_id',as:'affectedBy'})

    Incidente.belongsTo(User,{foreignKey:'usuario_solicitante_id',as:'requestedBy'})
    User.hasMany(Incidente,{foreignKey:'usuario_solicitante_id',as:'requestedBy'})

    Incidente.belongsTo(User,{foreignKey:'supervisor_id',as:'supervisedByIncident'})
    User.hasMany(Incidente,{foreignKey:'supervisor_id',as:'supervisedByIncident'})

    
}
