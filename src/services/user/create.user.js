import {PRIORITY,ROLS} from "@/share/constants"
import Model from "@/models"
import generate from "generate-password"
import {create as createToken} from "@/share/token.helper"
import bcrypt from "bcrypt"


export default class CreateUserService {

    async run(dto) {
        this.validateDTO(dto)
        try {
            
            return await this.create(dto)  
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError"){
                throw new Error(JSON.stringify({msg:"Existe datos duplicados",errors:error.fields}))
            }
            throw error
        }

    }

    async create(dto){
        const _password = (!dto.password) ? generate.generate({length:10,numbers:true}): dto.password
        const password = await bcrypt.hash(_password,12)
        const user = await Model.User.create({
            firstName: dto.first_name,
            lastName: dto.last_name,
            rol: dto.rol,
            email: dto.email,
            dni:dto.dni,
            password,
            confirmed: !!dto.password,
            priority: dto.priority,
            educationalInstitution: dto.educational_institution,
        })
        return {
            id:user.id,
            token: createToken(user),
            password:_password,
            email:user.email
        }
    }



    validateDTO(dto){
        const errors = {}
        if(!dto.first_name)
            errors["first_name"] = "*Campo obligatorio"
        if(!(ROLS.some(x=>dto.rol === x)))
            errors["rol"] = "*Campo invalido"
        if(!dto.last_name)
            errors["last_name"] = "*Campo obligatorio"
        if(!/^[0-9]{8}$/.test(dto.dni))
            errors["dni"] = "*Campo inválido"
        if( !(PRIORITY.some(x=> x ===  dto.priority)) )
            errors["priority"] = "*Campo obligatorio"
        if(!dto.email)
            errors["email"] ="*Campo obligatorio"
        if (Object.keys(errors).length > 0)
            throw new Error (JSON.stringify({msg:"Invalid Form",errors}))
    }
}