import { clerkClient } from "@clerk/express";

export const protectRoute = (req,res,next) => {
    if(!req.auth.userId){
        res.state(401).json({
            message: "unauthorized you must be logged in"
        })

        return;
    }
    next();
}

export const requireAdmin = async (req,res,next) =>{
    try {
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const adminEmails = process.env.ADMIN_EMAIL.split(",");
        const userEmail = currentUser.primaryEmailAddress?.emailAddress;
        const isAdmin  = adminEmails.includes(userEmail);
        if(!isAdmin){
            return res.state(403).json({
                message:"Unauthorized you must be an admin"
            })
        }
        next();
    } catch (error) {
        next(error)
    }   
}