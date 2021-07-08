import Model from "@/models"
import DateHelper from "@/share/timeHelpers"
import {connection} from "@/db.manager"


export default async function(){
    console.log("----------Updating closed incidents")
    const now = DateHelper.now()
    const incidentes = await Model.Incidente.findAll({
        include:[
            {model:Model.User,as:"requestedBy"},
            {model:Model.User, as: "supervisedByIncident"},
            {model:Model.User,as:'affectedBy'},
            {model:Model.Categoria,include:[{model:Model.Prioridad, as:'prioridad'}]},
            {model:Model.IncidenteLogs,as:"logs"}
        ]
    })
    const closedIncidentes = incidentes
    .filter(x=> x.status === 'resolved')
    .filter(x=> now.diff(new DateHelper(x.updatedAt)) >= 24)

    await Promise.all(closedIncidentes.map(x=> {
        return connection.transaction(t=>{
            return Model.Incidente.update(
                {
                    status:'closed',
                    fechaCierre: now.value()
                },
                {returning:true,where: [{id:x.id}],transaction:t}
            ).then(([rowsUpdated,[x]])=>{
                const {dataValues:incidente} = x
                return Model.IncidenteLogs.create({
                    comment: "El incidente se ha cerrado automáticamente" ,
                    tipo: 'incidente',
                    status:'closed',
                    event: `El incidente se ha cerrado `,
                    incidente_id:incidente.id,
                },{transaction:t})
            })
        })
    }))
    console.log("-----------Finishid batch for closing incidents")

}