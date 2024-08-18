//one hander and other hw
const Subsection=require("../models/SubSection");
const Section=require("../models/Section");
const { process } = require("ipaddr.js");
//upload coudaniary
const{uploadImageToCloudinary}=require("../utils/imageUplaoder");
//create subsection
exports.createSubsection=async(req,res)=>{
    try{
        //fetch data from req body
        const{sectionId,title,timeDuration,description}=req.body;
        //extract file video
        const video=req.files.videoFile;
        //valisdation
        if(!sectionId||!title||!timeDuration||!description){
            return res.status(400).json({
                success:false,
                message:"all fields req",
            })
        }
        //upload vide to cloudinary

        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a subsection

        const SubSectionDetails=await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        //push subsection id in section
        //populate

         const updatedSection=await Section.findByIdAndUpdate({},{$push:{
            subSection:SubSectionDeatails._id,
         }},
         {new:true});

         //hw log updaye section here after adding populate query
        //return res
        return res.status(200).json({
            success:true,
            messgae:"subsection created",
            updatedSection,
        });


    }
    catch(error){
  //return res
  return res.status(400).json({
    success:false,
    messgae:"subsection not created",
   // updatedSection,
});
    }
}

//hw
//update subsection
//delete subsection
 
