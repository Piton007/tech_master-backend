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
        } else throw new Error("Invalid Token")
    } catch (error) {
        console.log(error)
        res.status(401).send({
            message: "Invalid Authorization",
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
        } else throw new Error("Token Inválido")
    } catch (error) {
        res.status(401).send({
            message: error,
        })
    }
}
export const onlyTech = (req,res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    try {
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            if (!(["tech","admin"].some(x=>x===rol)))
                throw new Error("Insuficientes privilegios")
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("Token Inválido")
    } catch (error) {
        res.status(401).send({
            message: error,
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
        } else throw new Error("Token Inválido")
    } catch (error) {
        res.status(401).send({
            message: error,
        })
    }
}