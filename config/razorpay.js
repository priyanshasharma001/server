const { process } = require("ipaddr.js");
const razorpay=require ("razorpay");

exports.instance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET,
})