const Section=require("../models/Section");
const Course=require("../models/Course");
exports.createSection=async(req,res)=>{
    try{
        //data fetch
        const{sectionName,courseId}=req.body;
        //data validate
        if(!sectionName||!courseId){
        return res.status(400).json({
            success:false,
            message:"missing properties",

        });
    }
        //create section
        const newSection=await Section.create({sectionName});
        //update in course schema
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
                {new:true},
        );
            //ppulate
            //return response
            return res.status(200).json({
                success:true,
                message:"succesfull",
            })        
        
         


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create section"
        });

    }
}


//update section
exports.updateSection=async(req,res)=>{
    try{
        //data input
        const {sectionName,sectionId}=req.body;

        //data validation
        if(!sectionName||!sectionId){
            return res.status(400).json({
                success:false,
                message:"missing properties",
    
            });
        }
        //update data
        
        const section=await Section.findByIdAndUpdate(sectionId,{
            sectionName
        },
        {new:true}
    );
        //retrun response
        return res.status(200).json({
            success:true,
            message:"section updated successfully "
        });


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to update section"
        });

    }
}


//delete section

exports.deleteSection=async(req,res)=>{
    try{
        //get id-assumin that we are sending id
        const{sectionId}=req.params

        //use findbyid
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"section delete successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to delete Section,please try again",
        });
    }
}