//send otp
//signup
//login
//changepasswaord
//middleware token validy is student is admin
//resetpassword reset passwaod token
  


//send otp  logic : sendotp fun otp :email from req body signup user exit to  i krta if yes returm res not exist otp generate unique otp otp store in db so the we can verify user user typed otp
//bsss res send
 
const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator"
);
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { configDotenv } = require("dotenv");
const { message } = require("statuses");


exports.sendOTP=async(req,res)=>{
    try{
    const {email}=req.body;

    //check if user exist
    const checkUserPresent=await User.findOne({email});

    //if user exist then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:'user alredy exist'
,        })

    }


    //generate otp

    let otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });

    console.log("otp generated");
    //check unique otp or not

    const result=await OTP.findOne({otp:otp});
//check if our otp is unique or not
 //not a good preactice but we dont have unique otp generator
while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        const result=await OTP.findOne({otp:otp});
    }
//otp entry in dataase4
const otpPayLoad={email,otp};
//create an entry in db
const otpBody=await OTP.create(otpPayLoad);
res.status(200).json({
    success:true,
    message:'otp send suncesfully',
    otp,
})
    }
catch(error){
    console.log(error);
    res.status(401).json({
        success:false,
        message:"not successfull entry"
})
}
};




//sign up


exports.signUp=async(req,res)=>{
    //data fetch from body
    try{
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp

    }=req.body;
    //validate krlo
    if(!firstName||!lastName||!email||!confirmPassword||!otp
        ){
            return res.status(403).json({
                success:false,
                message:"All fields are required",

            })

        }   
        
        
        //password match pasword confirm password
           
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'password and confirm password donot exist'
            });
        }


    //check usere exist or not

    const existuser=await User.findOne({email});
    if(existuser){
        return res.status(400).json({
            success:false,
            message:"user already exist"
        });
    }
    //find most recent otp for the user
 const recentotp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
 console.log(recentotp)



    //validate otp from input and from db


    if(recentotp.length==0){
        return res.status(400).json({
            success:false,
            message:"otp not found"
        });
    }

    else if(otp !==recentotp.otp){
        return res.status(400).json({
            success:false,
            message:"otp not matching"
        });  
    }
    //password hash 

    const hashedPassword=await bcrypt.hash(password,10);
    //we need bcrypt for this
    const profileDetails= await Profile.create({
        gender:null,
        dateIfBirth:null,
        about:null,
        conatctNumber:null,
    });
    const User= await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
       // confirmPassword,
        accountType,
        additionalDeatails:profileDetails
       // contactNumber,
       // otp 
       //dicebear api avatar not compele
       //image:`https://api.dicebear.com/5.x/initails/svg`,
    })
    return res.status(200).json({
        success:true,
        message:"user is registed successfully",
        user,
    });

}
catch(error){
    console.log(error);
    return res.status(500).json({
        successfalse,
        message:'user can not be registre plzz try again',
    });
}
    
    
    //and create entry in db


}



//login
exports.login=async(req,res)=>{
    try{

        //get data from req body
        const {email,password}=req.body;
        //validation of data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:"all fields are required",
            });
        }
        //user check if registred of not

        const user =await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(403).json({
                success:false,
                message:"user is  not registered",
            });
        }


        //generate jbtmtoken after password is matched
    if(await bcrypt.compare(password,user.password)){


        const payload={
            email:user.email,
            id:user._id,
            role:user.accountType,
        }


       const token =jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
          });

          user.token=token;
          user.password=undefined;
    

        //create cookie and send response

        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
//cokei cokkei name token otions needed to be passes
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"logged in successfully"
        })
    } else{
        return res.status(401).json({
            success:false,
            message:"password is incorrect"
        });

    }





    }
    catch(error){
        console.log(error)
        return res.status(401).json({
            success:false,
            message:"login failure try again"
        });


    }
};

//changepassword
exports.changePassword=async(req,res)=>{
     //get data from req body
     //get old password new password
     //confirm newpw
     //valdation empty 
     //update pw in db
     //password updated return 

}