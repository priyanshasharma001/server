const express=require("express");
const app=express();

const  userRoutes=require(".routes/User");
const  profileRoutes=require(".routes/Profile");
const  paymentRoutes=require(".routes/Payments");
const  courseRoutes=require(".routes/Course");

const database=requiure("./config/database");

const cookieParser=require("cookie-parser");
//npm cors
const cors=require("cors");
const{cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

const PORT=process.env.PORT||4000;

//database connect

database.connect();
//middleware

app.use(express.json());
app.use(cookieParser());
app.user(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//cloudinary connection
cloudinaryConnect();
//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/Profile",profileRoutes);
app.use("/api/v1/course",paymentRoutes);
app.use("/api/v1/payment",userRoutes);
//def route

app.length("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up an druunning"
    });
});

app.listen(PORT,()=>{
    console.log(`app is running at ${PORT}`)

})

