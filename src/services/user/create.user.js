import {PRIORITY,ROLS} from "@/share/constants"
import Model from "@/models"
import generate from "generate-password"
import {create as createToken} from "@/share/token.helper"
import bcrypt from "bcrypt"
import {connection} from "@/db.manager"
import DateHelper from "@/share/timeHelpers"




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
        const user = await this._create({...dto,newPass:password})
        return {
            id:user.id,
            token: createToken(user),
            password:_password,
            fechaCreacion: new DateHelper(user.createdAt).toString(),
            email:user.email,
            firstName:user.firstName,
            cel:user.cel,
            lastName:user.lastName,
            confirmed:user.confirmed,
            rol:user.rol,
            dni:user.dni,
            priority:user.priority,
            educationalInstitution:user.educationalInstitution,
            log:user.log
        }
    }

    async _create(dto){
        return connection.transaction((t)=>{
            return Model.User.create({
                firstName: dto.first_name,
                lastName: dto.last_name,
                rol: dto.rol,
                email: dto.email,
                cel:dto.cel,
                dni:dto.dni,
                password: dto.newPass,
                confirmed: !!dto.password,
                priority: dto.priority,
                educationalInstitution: dto.educational_institution,
            },{transaction:t}).then((user)=>{
                if(!dto.requerimiento_id) return user
                return Model.UserLogs.create({
                        requerimiento_id:dto.requerimiento_id,
                        user_id:user.id
                    },{transaction:t}).then((log)=>{
                        return Model.UserLogs.findAll({
                            where:{id:log.id},
                            include:[
                            {model:Model.Requerimiento,as:"requerimiento",
                            include:[
                                {model:Model.User,as:"reportedBy",attributes:["firstName","lastName","rol","email","dni"]},
                                {model:Model.User,as:"supervisedBy",attributes:["firstName","lastName","rol","email","dni"]}
                            ]}],transaction:t
                        }).then(logs=>{
                            const [_log] = logs
                            return {...user.dataValues,log:_log}
                        })
                    })
                
               
            })
        })
    }

  

    validateDTO(dto){
        const errors = {}
        if(!dto.first_name)
            errors["first_name"] = "Nombres son obligatorio"
        if(!(ROLS.some(x=>dto.rol === x)))
            errors["rol"] = "Rol es obligatorio"
        if(!dto.last_name)
            errors["last_name"] = "Apellidos son obligatorios"
        if(!dto.cel)
            errors["celular"] = "Celular es obligatorio"
        if(!/^[0-9]{8}$/.test(dto.dni))
            errors["dni"] = "Dni válido"
        if( !(PRIORITY.some(x=> x ===  dto.priority)) )
            errors["priority"] = "Prioridad inválida"
        if(!dto.email)
            errors["email"] ="Email obligatorio"
        if (Object.keys(errors).length > 0)
            throw new Error (JSON.stringify({msg:"Error al crear usuario",errors}))
    }
}