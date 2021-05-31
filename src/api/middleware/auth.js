import { verify } from "jsonwebtoken"

export default async (req,res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    try {
        if (!!token) {
            const {rol,id} = verify(token, process.env.JWT_KEY)
            req.body.auth  = {
                rol,
                id
            }
            next()
        } else throw new Error("Invalid Token")
    } catch (error) {
        res.status(401).send({
            message: error,
        })
    }
}