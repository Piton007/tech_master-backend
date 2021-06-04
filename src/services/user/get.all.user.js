import Model from "@/models"
import {Op} from "sequelize"

export default class GetAllUserService {
    constructor(){

    }

    async run ({id:adminId}){
        return (await this._getAll(adminId)).map(this.assembleToResponse)
    }

    async _getAll(adminId){
        return (await Model.User.findAll({
            where:{
                [Op.or]:[{rol:"tech"},{id:adminId}]
            }
        }))
    }


    assembleToResponse(user){
        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            rol:user.rol,
            email:user.email,
            dni:user.dni,
            priority:user.priority,
            educationalInstitution:user.educationalInstitution,

        }
    }
 }