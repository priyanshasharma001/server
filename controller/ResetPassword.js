const User=require("../models/User");
const mailSender=required("../itils/mailSender");
const bycrpt=require("bcrypt");
//reset pw token
exports.resetpasswordToken=async(req,res)=>{
    //get email from req body

  try{
    const email=req.body.email;
    const user=await User.findOne({email:email});
   if(!user){
    return res.json({
        success:false,
        message:"not user ",
    })
   }

    //check uder for email or validation
    const token=crypto.randomUUID();
    //gerenrate link with he help of url having token
    const updatedDetails=await User.findOneAndUpdate({emails:email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000,
    },
    {new:true});
    
    //token generate
    //update by adding token and exire tym
    //create url
const url='//routes';
    //send mail  
    
   return res.json({
    success:true,
    message:"Email send successfully",
   });
     
   
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
        success:true,
        message:"reset pw not successfull",
       });
  }
}

//reset pw
exports.resetPassword=async(req,res){
    //data fetch
    //validation
    //token use to get user entry as it is unique
    try{
    const userDetails=await User.findOne({token:token});
    //if no entry-envalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:"tken is invalid",
        });
    }
    //token tym \
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:"token is expired",
        });
    }
    //hash pw
    const hashedPassword=await bycrpt.hash(password,10);


    //pw update
    await User.findOneAndUpdate({token:token},
        {password:hashedPassword},
        {new:true},
    );
    //ret response
  return res.status(200).json({
    success:true,
    message:"password reset done",
  }) ;
}
  
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"password reset is not done",
          }) ;
        }

    }
