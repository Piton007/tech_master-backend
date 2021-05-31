import {verify as _verifiy,sign} from "jsonwebtoken"

export async function  verify(token){
    try {
       return await _verify(token,process.env.JWT_KEY)
    } catch (error) {
        throw new Error("Invalid Token")
    }
}
export function create(user){
    return "Bearer "+sign({rol:user.rol,id:user.id},process.env.JWT_KEY,{expiresIn:"1d"})
}