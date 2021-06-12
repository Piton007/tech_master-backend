import {connection} from "@/db.manager.js"
import bcrypt from "bcrypt"
import Model from "@/models"


export default class ChangePasswordService {
    async run(dto){
      this.validateDTO(dto)
      await this.update(dto)   
    }

    async update(dto){
        const password = await bcrypt.hash(dto.password,12)
        return connection.transaction(t=>{
            return Model.User.update({
                password,
                confirmed:true
            },{where:[{id:dto.user_id}],transaction:t})
        })
    }

    validateDTO(dto){
        const errors = {}
        if(!dto.user_id)
            errors["user_id"] = "Usuario obligatorio"
        if(!dto.password)
            errors["password"] = "Nuevo password obligatorio"
        if(Object.keys(errors).length > 0)
            throw new Error(JSON.stringify({msg:"Invalid Form",errors}))
    }
}