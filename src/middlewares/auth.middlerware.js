import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const varifyJWT = asyncHandler(async (req, _, next) => {

    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            throw new ApiError(401, "You are not authorized to access this resource");
        }
        // console.log("Cookies:", req.cookies)
        // console.log("Token from Cookie:", req.cookies.accessToken)
        // console.log("Secret:", process.env.ACCESS_TOKEN_SECRET)

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
   

        // console.log(decodedToken)
        if (!decodedToken) {
            throw new ApiError(401, "Invalid token");
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");


        // console.log(user)
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        req.user = user;

        next();
    } catch (error) {
        throw new ApiError(401, error.message || "You are not authorized to access this resource");
    }
})

    //     Sab se pehle token ko request se nikaala ja raha hai.

        // - Agar token cookie mein mila(`req.cookies.accessToken`), to usko lo.  
        // - Warna`Authorization` header se `"Bearer <token>"` format mein se token ko split karke sirf token uthaya ja raha hai.
        // console.log(token)


    //     Token milne ke baad usko **verify** kar rahe hain using           `ACCESS_TOKEN_SECRET`.  
        // Ye dekha ja raha hai ke token:

        // - valid hai ya nahi  
        // - expire to nahi ho gaya  
        // - kis user ka hai

    // Agar verification pass ho gaya to `decodedToken` mein user ki info aa jati hai (usually `_id`, role, etc).
           
    // Ab database se **user** ko dhoonda ja raha hai using `decodedToken._id`.  Aur security ke liye: - `password` aur `refreshToken` fields exclude ki ja rahi hain.
 
            // User milne ke baad usko `req.user` mein store kar diya ja raha hai, taake baaki middleware ya route handlers use kar sakein.
        // Agar token verify karne mein koi error aata hai, to usko catch block
