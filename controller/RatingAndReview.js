const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Courses");
const { default: mongoose } = require("mongoose");
//create rating

exports.createRating=aync(req,res=>{
    try{
        //getuser id
        const userId=req.user.id;
        //fetchdata from req body
        const {rating,review,courseId}=req.body;
        //check if user is enrooled or not
        const courseDeatails=await Course.findOne({_id:courseId,
                                               studentsEnrolled:{$eleMatch:{$eq:userId}},


                                              });
        
        if(!courseDeatails){
            return res.status(400).json({
                success:false,
                message:"student not enrolled",
            })
        }
        //check if user already given a review

        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        });
        if(alreadyReviewed){
            return res.status(500).json({
                success:false,
                message:"student already review enrolled user",
            })


        }
        //create rtaing and review
        const ratingReview=await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        })

      //  update course 
      const updatedCourseDeatails=await Course.findByIdAndUpdate({_id:courseId},
        {
            $push:{
                ratingAndReviews:ratingReview._id ,

            }
            },
            {new:true});
      
        //retun response
        return res.status(200).json({
            success:true,
            message:"review added of enrolled user",
        })


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"no rview",
        })
    };

//get avg rating

exports.getAverageRating=async(req,res)=>{
    try{
        //course id input
        const courseId=req.body.courseId;
        //cal avg rating
        const result=await RatingAndReview.aggregate([{
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
                
            },
        },
        {
            $group:{
                _id:null,
                getAverageRating:{$avg:"$rating"},
            }

        }
        ])


        //retur rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,


            });

        }
        //if no resuly
        return res.status(200).json({
            success:false,
            message:"no rating is there",
            averageRating:0,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"no rating is there",
            //averageRating:0,
        });

    }
}





//getall rating
exports.getAllRating=async(req,res)=>{
   try{
    const allReviews=await RatingAndReview.find({})
                                     .sort({rating:desc})
                                     .populate({
                                        path:"user",
                                        select:"firstName lastName email image"
                                     })
                                     .populate({
                                        path:"course",
                                        select:"courseName",

                                     })
                                     .exec();

                                     return res.status(200).json({
                                        success:true,
                                        message:"all ratings",
                                        //averageRating:0,
                                        data:allReviews,
                                    });

   } 
   catch(error){

   }
}

