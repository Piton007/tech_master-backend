import { verify } from "jsonwebtoken"

export const all = (req,res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("La sesión ha expirado")
    } catch (error) {
        console.log(error)
        res.status(401).send({
            msg: "Error de autenticación",
            errors:{
                token:error.message
            }
        })
    }
}

export const onlyClient = (req,res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    try {
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            if (!(["volunteer","teacher"].some(x=>x===rol)))
                throw new Error("Insuficientes privilegios")
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("La sesión ha expirado")
    } catch (error) {
        res.status(401).send({
            msg: "Error de autenticación",
            errors:{
                token:error.message
            }
        })
    }
}
export const onlyTech = (req,res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    try {
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            if (!(["tech","admin","tech_2"].some(x=>x===rol)))
                throw new Error("Insuficientes privilegios")
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("La sesión ha expirado")
    } catch (error) {
        res.status(401).send({
            msg: "Error de autenticación",
            errors:{
                token:error.message
            }
        })
    }
}

export const onlyAdmin = (req,res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    try {
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            if (rol !== "admin")
                throw new Error("Insuficientes privilegios")
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("La sesión ha expirado")
    } catch (error) {
        res.status(401).send({
            msg: "Error de autenticación",
            errors:{
                token:error.message
            }
        })
    }
}