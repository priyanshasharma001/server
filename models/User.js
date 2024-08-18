const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName:{String,
    required:true,
    trim:true,
},
    
    lastName:{String,
    required:true,
    trim:true,
},
    
    email:{String,
    required:true,
    trim:true,
},
    
    password:
    {String,
    required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },

    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        reuired:true,
        ref:"Profile",
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        
        ref:"Course",
    }],
    image:{
        type:String,
        require:true,
    },
    token:{
        type:String,
    },
 resetPasswordExpires:{
    type:Date,
 },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
       
        ref:"CourseProgress",
 } ],
});
module.exports=mongoose.model("User",userSchema);