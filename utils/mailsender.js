//to send mail
const nodemails=require("nodemailer");
 
const mailSender=async(email,title,body)=>{
    try{

        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        let info=await transporter.sendMail({
            from:'studyNotion || codehelp-by babbar',
            to:`&{email}`,
            subject:`${title}`,
            html:`${body}`,
        })

    }
    catch{

    }
}
module.exports=mailSender;