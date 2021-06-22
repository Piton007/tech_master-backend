import bcrypt from "bcrypt"
import Model from "@/models"
import {create as createToken} from "@/share/token.helper"


export default class LoginUserService {
    constructor(){

    }

    async run(dto){
        this.validateDTO(dto)
        const user = await this.getUser(dto)
        await this.validatePassword(dto,user)
        return {
            id:user.id,
            rol:user.rol,
            firstname:user.firstName,
            lastname:user.lastName,
            token: createToken(user),
            email:user.email,
            confirmed:user.confirmed
        }

    }

    async getUser(dto){
        
        const user = await Model.User.findOne({
            where:{email:dto.email}
        })
        if(!user)
            throw new Error(JSON.stringify({msg:"Error al iniciar sesión",errors:{email:"No existe usuario con ese email"}}))
        return user
    }

    async validatePassword(dto,user){
        const result = await bcrypt.compare(dto.password,user.password)
        if (!result)
            throw new Error(JSON.stringify({msg:"Error al iniciar sesión",errors:{'contraseña':"Contraseña incorrecta"}}))
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.email)
            errors["email"] = "Email obligatorio"
        if(!dto.password)
            errors["password"] = "Contraseña obligatoria"
        if (Object.keys(errors).length > 0)
            throw new Error (JSON.stringify({msg:"Error al iniciar sesión",errors}))
    }
}