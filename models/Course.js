const mongoose=required("mongoose");
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },

     whatYouWillLearn:{
        type:String,
     },
     courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
        
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
        
    }],

    price:{
        type:Number,
    },
     thumbnail:{
        type:String,
     },

     tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
        //required:true,
    },

    studentEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    instructions:{
        type:[String],
    },
    status:{
        type:String,
        enum:["Draft","Published"],
    }
});




module.exports=mongoose.model("Course",courseSchema)