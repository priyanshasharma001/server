const mongoose=require("mongoose");
const OTPSchema=new mongoose.Schema({
 email:{
    type:String,
    required:true

 } ,  
    
 otp:{
    type:String,
    required:true,

 } ,  
    
 createdAt:{
    type:Date,
    defaukt:Date.now(),
    expires:5*60,

 } 
 

    

});

//schema ke bad model ke pehle
async function sendVerficationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"Verification email from studynotion",otp);
        console.log("email send",mailResponse);
     
    }
    catch(error){
      console.log("error occur while sending mail",error);
    throw error;
    }

}


OTPSchema.pre("save",async function(next)
{
    await sendVerficationEmail(this.email,this.otp);
    next();
}


module.exports=mongoose.model("OTP",OTPSchema);