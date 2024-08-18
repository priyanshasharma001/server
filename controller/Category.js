const Tag=require("../models/tags");
//create a atg handler funct
exports.createCategory=async(req,res)=>{
    try{
        //fetch
        const {name,description}=req.body;
        //validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"all feilds are requires",
            });
        }
        //create entry in dv
   const CategoryDetails=await Tag.create({
    name:name,
    description:description,
   });
   console.log(tagDetails);
   //return response
   return res.status(200).json({
    success:true,
    message:"tag created successfully",
   })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//get all tags
exports.showAllCategory=async(req,res)=>{
    try{
   const allTags=await Tag.find({},{name:true,descripton:true});
    res.status(200).json({
        success:true,
        message:"all tags return successfully",
    });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }
}

exports.categoryPageDetails=async(req,res)=>{
    try{
        //get cat id
        const {categoryId}=req.body;
        //cat corr courses
        const selectCategory=await Category.findById(categoryId)
        .populate("courses")
        .exec();
         //fetch
         //validation
         if(!selectCategory){
            return res.status(404).json({
                success:false,
                message:"no course",
            })
         }


         //get course for diff cat
         const differentCategories=await Category.find({
            _id:{$ne:categoryId},
         })
         .populate("'courses")
         .exec();
         //get top selling course

         //hw
         //return 
         return res.status(200).json({
            success:true,
            data:{
                selectCategory,
                differentCategories,
            }

         });


    }
    catch(error){
        console.log(error);
        return res.status.json({
            success:false,
           
            message:""
        })
    }
}
