import { errorHandler } from "./error"
import {jwt} from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    // because inside the cookie we have gave it the naem access token  
    const token = req.cookies.access_token

    if (!token) return next(errorHandler(401, 'unAuthorized'))

        // we get th user data 
    jwt.verify(token, process.env.JWT_SECRET,(err, user) => {
        if (err) return next(errorHandler(403, 'forbidden/ no valid token'))
//  we send it from this section, it is used to send user data , req.user (data) is just the ide of the user 
        req.user = user;
// next() is going to take use to take use to the next section updateUser() 
        next();
    })


}