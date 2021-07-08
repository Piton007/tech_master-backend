import Model from "@/models"
import DateHelper from "@/share/timeHelpers"

export default class GetAllUserService {
    constructor(){

    }

    async run (dto){
        if (dto.auth.rol === 'admin' || dto.auth.rol.includes('tech'))
            return (await this._getAll()).map(this.assembleToResponse)
        return (await this._getAll()).filter(x=>x.rol === 'teacher' || x.rol === 'volunteer').map(this.assembleToResponse)
    }

    async _getAll(){
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
            cel:user.cel,
            confirmed:user.confirmed,
            email:user.email,
            fechaCreacion: new DateHelper(user.createdAt).toString(),
            dni:user.dni,
            priority:user.priority,
            educationalInstitution:user.educationalInstitution,
            log: user.log
        }
    }
    
 }