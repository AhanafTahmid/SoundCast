import {User} from '../models/user.model.js'; // Adjust the path as needed

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUser = req.auth.userId
        const users = await User.find({clerkId: { $ne: currentUser}}); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        next(error); // Pass any errors to the error-handling middleware
    }
};