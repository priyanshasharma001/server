const jwt=require("jsonwebtoken");
require("dotenv").config();
const User= require("../models/User");


//auth 
//s1:json token verify
//token extract cokkie ,body, token
exports.auth=async(req,res,next)=>{
    //ordering in routes
    
        //extract token
        const token=req.cookies.token||req.body.token||req.header("Authorisation").replace("Bearer","");
try{
     //if token missing
     if(!token){
        return res.status(401).json({
            success:false,
            message:"token is not ther",
        });
     }
     //verify the token

try{
    const decode= jwt.verify(token,process.env.JWT_SECRET);
    console.log(decode);
    req.user=decode;
}
catch(err){
    return res.status(401).json({
        success:false,
        message:'token in isnvalid',
    });
}

next();






    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:" in isnvalid",
        });


    }
}
//isstudent

exports.IsStudent=async(req,res,next)=>{
    try{
       //from payload which created controller auth
       if(req.user.accountType!="Student"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for student only"
        });
       }
       next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"access not allowed"
        })
    }

}

//is c
//same code
exports.IsInstuctor=async(req,res,next)=>{
    try{
       //from payload which created controller auth
       if(req.user.accountType!="Instructor"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for instructor only"
        });
       }
       next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"access not allowed"
        })
    }

}


//is admin
exports.IsAdmin=async(req,res,next)=>{
    try{
       //from payload which created controller auth
       if(req.user.accountType!="Admin"){
        return res.status(401).json({
            success:false,
            message:"this is protected route for Admin only"
        });
       }
       next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"access not allowed"
        })
    }

}
