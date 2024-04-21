const ErrorHandler = require("../utils/ErrorHandler");
const checkErrors = require("./checkErrors");
const jwt = require("jsonwebtoken");
const Auth = require("../routes/auth");
const JWT_SECRET = "$ad@!hddd@jkh%&JJJ#";

   
exports.isAuthenticated = checkErrors(async (req, res, next) => {  
    const token = req.header('token');
    if (!token) return next(new ErrorHandler("Please Login to Continue!", 400));
    const data = jwt.verify(token,JWT_SECRET);
    const _id = data.user.id;
    req.user = await Users.findById(_id).select("_id name role");

    next();
});

// Only allows the Authorised user to use the respective route.
// i.e. If authorised role is employer, then only employer can use this route.
// i.e. If authorised role is user, then only user can use this route.
// This functiion will not work without 'isAuthenticared' middleware.
exports.authorizedRole = (role) => {
    return (req, res, next) => {
        if (req.user.role.includes(role)) {
            next();
        }
        else {
            return next(new ErrorHandler("You are not Authorised to access this page", 400));
        }
    }
}



exports.isAuthenticatedAdmin = checkErrors(async (req, res, next) => {
   
    const token = req.header('token');
    
    if (!token) return next(new ErrorHandler("Please Login to Continue!", 400));

    const data = jwt.verify(token,JWT_SECRET);
    const _id = data.user.id;
    req.user = await Admin.findById(_id).select("_id name role");

    next();
});