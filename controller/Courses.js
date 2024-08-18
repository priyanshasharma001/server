const Course=require("../models/Course");
const Tag=require("../models/tags");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
exports.createCourse=async(req,res)=>{
    try{
        //fetch data
        const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
        //validation

        if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag){
            res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //chek for instructor
        const userId=req.user.id;
        const instructordetalis=await User.findById(userId);
        console.log("instructor details",instructordetalis);
        if(!instructordetalis){
            return res.status(404).json({
                success:false,
                message:"instructor details not found",
            });
        }
        //chekc tag is valid or not
        //from  frontend it will be valid but from backend it can be invalid
        const tagDetails=await tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"instructor details not found",
            });
        }
    
    //upload image from cloudianry
    const thumbnailImage= await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
//create entry fro new course
const newCourse=await Course.create({
    coursename,
    courseDescription,
    instuctor:instructordetalis._id,
    whatYouWillLearn:whatYouWillLearn,
    price:price,
    tag:tagDetails._id,
    thumbnail:thumbnailImage.secure_url,
})
    

    //add the new coirse to the user scheam of instrcutior
    await User.findByIdAndUpdate({_id:instructordetalis._id},{
        $push:{
            courses:newCourse._id,
      },
    },
     {new:true},
    );

    //update the tag and schema




    ////return response

    return res.status(200).josn({
        success:true,
        message:"course created successfully",
        data:newCourse,
    });
}
   catch(error){
    console.log(error);
    return res.status(200).josn({
        success:fasle,
        message:"course created not  successfully",
        //data:newCourse,
   } );
}
};

//get all courses

exports.showAllCourses=async (req,res)=>{
    try{
        const allcourses=await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }).polpulate("instructor")
        .exec();

        return res.status(200).json({
            success:true,
            message:"data of all courses  fetchd ",
            data:allcourses,

        });
}
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch course details",
            
            error:error.message,
        })

    }
}

//get couse detaols
exports.getCourseDetails=async(req,res)=>{
    try{

        //get id
        const {courseId}=req.body;
        //find course details
        const courseDetails=await Course.find({
            id:courseId})
            .polpulate({
                //section and subsecton
                path:"instructor",
                populate:{
                    path:"additionalDetails",

                }

            }
        )
        .populate("category")
        .populate("ratingAndreviews")
        .populate({
            path:"courseContent",
            polpulate:{
                path:subSection
            }
        })
        .exec(); 

        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`could not fetch course with course id ${courseId}`
            });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"course details fetched successdully",
            data:courseDetails,
        })




    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"course details not fetched successdully",
          //  data:courseDetails,
        })
        

    }
}