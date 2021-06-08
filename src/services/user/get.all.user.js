import Model from "@/models"
import DateHelper from "@/share/timeHelpers"

export default class GetAllUserService {
    constructor(){

    }

    async run ({id:adminId}){
        return (await this._getAll(adminId)).map(this.assembleToResponse)
    }

    async _getAll(adminId){
        return (await Model.User.findAll({
            include:[
                {model: Model.UserLogs,as:"log", include:[
                    {model:Model.Requerimiento,as:"requerimiento",include:[
                        {model:Model.User,as:"reportedBy",attributes:["firstName","lastName","rol","email","dni"]},
                        {model:Model.User,as:"supervisedBy",attributes:["firstName","lastName","rol","email","dni"]}
                    ]} ]}
            ]
        }))
    }

    assembleToResponse(user){

        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            rol:user.rol,
            email:user.email,
            fechaCreacion: new DateHelper(user.createdAt).toString(),
            dni:user.dni,
            priority:user.priority,
            educationalInstitution:user.educationalInstitution,
            log: user.log
        }
    }
    
 }