
const jwt=require('jsonwebtoken');
exports.requireSignIn = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      // Verify the token
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      // Log the generated token and verification result
      // console.log('Generated Token:', token);
      // console.log('Token Verification Result:', user);
      req.user = user;
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Authorization header missing" });
  }
};
exports.userMiddleware=(req,res,next)=>{
   // console.log(req.user.role)
    if(req.user.role!=="user"){
        return res.status(400).json({message:" User Access denied"})
    }
    next();
}
exports.adminMiddleware=(req,res,next)=>{
    if(req.user.role!=="admin"){
        return res.status(400).json({message:" Admin Access denied"})
    }
    next();
}
exports.serviceCenterMiddleware=(req,res,next)=>{
    // console.log(req.user.role)
     if(req.user.role!=="ServiceCenter"){
         return res.status(400).json({message:" serviceCenter Access denied"})
     }
     next();
 }
 exports.employeeMiddleware=(req,res,next)=>{
    // console.log(req.user.role)
     if(req.user.role!=="employee"){
         return res.status(400).json({message:" employee Access denied"})
     }
     next();
 }