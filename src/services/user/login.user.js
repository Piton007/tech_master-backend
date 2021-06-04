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
            token: createToken(user),
            email:user.email
        }

    }

    async getUser(dto){
        
        const user = Model.User.findOne({
            where:{email:dto.email}
        })
        if(!user)
            throw new Error(JSON.stringify({msg:"Invalid Form",errors:{email:"No existe usuario con ese email"}}))
        return user
    }

    async validatePassword(dto,user){
        const result = await bcrypt.compare(dto.password,user.password)
        if (!result)
            throw new Error(JSON.stringify({msg:"Invalid Form",errors:{password:"Contraseña incorrecta"}}))
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.email)
            errors["email"] = "*Campo obligatorio"
        if(!dto.password)
            errors["password"] = "*Campo obligatorio"
        if (Object.keys(errors).length > 0)
            throw new Error (JSON.stringify({msg:"Invalid Form",errors}))
    }
}