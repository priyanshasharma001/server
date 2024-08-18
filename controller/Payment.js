const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailsender=require("../utils/mailsender");
const{courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
exports.capturePayment=async(req,res)=>{
    try{
        //get course id user id
        const  {course_id}=req.body;
        const userId=req.user.id;
        //valid id
        if(!course_id){
            return res.status.json({
                success:false,
                message:"valid id nhi h",
            });
        }
        //valid courseDeatils
        let course;
        try{
            course=await Course.findById(course_id);
            if(!course){
                return res.status.json({
                    success:false,
                    message:"could not find the course",
                }); 
            }
        
        //user pay for same course
        //user id in string covert to object id
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"student is already enrolled"
            });
        }
    }


    
    catch(error){
        return res.status(400).json({
            success:false,
            message:"no payment"
        });
    }

    //order create
    const amount=course.price;
    const currency="INR";
    const options={
        amount=amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    };
    try{
        //initite the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.id,
            amount:paymentResponse.amount,
        });
    }
    catch(error){
        console.log(error);
        res.json({
            success:false,

        })
    }



    

    //verify signature
    exports.verifySignature=async(req,res)=>{
      const webhookSecret='1233455';
      //via razorpay
      const  signature=req.headers["x-razorpay-signature"];
     //webhook secret hash
 //3steps 
 //s1
    const shasum=crypto.createHmac("sha256",webhookSecret);
    //s2
    shasum.update(JSON.stringyify(req.body));
    //s3
    const digest=shasum.digest("hex");
    //match webhook and signatue

    if(signature===digest){
        console.log("payment authorised");

    
    //action after
    //course enroll the student
    //user and course mapping from both side
    //using notes
    const {courseId,uderId}=req.body.payload.payment.entity,motes;
    try{
        //fulfill action
        //find the course and enroll the student in it
        const enrolledCourse =await Course.findOneAndUpdate(
           {_id:courseId},
           {$push:{studentsEnrolled:userId}},
           {new:true}, 
        );
        if(!enrolledCourse){
            return res.status(400).json({
                success:false,
                message:"course not found",

            });
        }

    
    console.log(enrolledCourse);

    
    //find student and add student to enrooled course
    const enrolledStrudent =await User.findOneAndUpdate(
        {_id:userId},
        {$push:{courses:courseId}},
        {new:true}, 
     );

     //mail semd the you have enrooled
     //use maislender
     //template of mail is in mail/template

     const emailResponse=await mailSender(
        enrolledStrudent.email,
        "Congratulations",
        "congrtaulation you are enboarded into new codehelp course",


        
     );
     console.log(emailResponse);
       return res.json(200).json({
        success:true,
        message:"signature verifies and course"
       })


    }
    catch(error){
        return res.json(500).json({
            success:false,
            message:"signature verifies and not course"
           });
    

    }
    }
    
    else{
        return res.json(500).json({
            success:false,
            message:"signature not  verifies and course"
           });

    }

    };