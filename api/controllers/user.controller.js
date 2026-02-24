import User from "../models/user.model"
import { errorHandler } from "../utils/error"
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({
        name: "sarim nadeem"
    })
}

export const updateUser = async (req, res, next) => {
    // req.params.id is the url that we have give in the route let me show you 
    // 
    // router.post('/update/:id', verifyToken, updateUser)
    
    if(req.user.id !== req.params.id) return next(errorHandler(401), "unAuthorized")

    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)

        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            // it is the mongodb operator that only updates the specific fields that you want it to do
            $set:{
                username: req.body.username, 
                email : req.body.email, 
                password: req.body.password,
                avatar: req.body.avatar
            }
            // this new true is going to update the user with the new info not the old one 
        }, {new : true}) 
    } catch (error) {
        next(error)
    }
}