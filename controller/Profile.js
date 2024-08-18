//no need to create profile

//update profile
const Profile=require("../models/Profile");
const Uder=require("../models/")

exports.updateProfile=async(req,res)=>{
    try{
         //getdata
         const {dateofBirth="",about="",contactNumber,gender}=req.body;
         //getuserid from auth [payload in middleware]
         const id=req.user.id;
         //validation
         if(!contactNumber||!gender){
            return res.status(400).json({
                success:false,
                message:"fields are requires",
            })
         }
          

         //find profile having null value
         //from user we get profile if
         const userDeatails=await UserActivation.findById(id);
         const ProfileId=userDeatails.additionalDeatails;
         const profileDetails=await profile.findBy(peofileId);


         //update profile
         profileDetails.dateofBirth=dateofBirth;
         profileDetails.about=about;
         profileDetails.contactNumber=contactNumber;
         profileDetails.gender=gender;

         await profileDetails.save();
         //ret res
         return res.status(200).json({
            success:true,
            message:"updated profile",
            profileDetails,

         });



    }
    catch(error){
        return res.status(400).json({
            success:false,
            //message:""
            error:error.message,
        });

    }
}


//delete account
exports.deleteAcoount=async(req,res)=>{
    try
    {
        //get id
        const id=req.user.id;
        //valid
        const uderDetails=await UserActivation.findById(id);
        if(!userDeatils){
            return res.status(400).json({
                success;false,
                message:"user not found",
            })
        }
        ///profile delete 
        await Profile.findByIdAndDelete({_id:userDeatails.additionalDeatails});
        //user del
        await UserActivation.findByIdAndDelete({id:id});
        //to unenroll user from all enroll

        //res return
        return res.status(200).json({
            success:true,
            message:"user deleted successfully",
        })
        //explore how to schedule timing

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user id cannot be deleted"
        });

    }
}
//

exports.getAllUserDetails=async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //get user and validation
        const userDetails=await UserActivation.findById(id).populate("additionalDeatails").exec();
        return res.status(200).json({
            success:true,
            message:"user data fetched successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user data cannot be get"
        });

    }
}
