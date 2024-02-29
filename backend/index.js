const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const passport =require('passport')
const cookiesession =require('cookie-session')
const passportsetup=require("./passport")
const jwtSecret="MyNameIsEnduvasiSrihariDinesh!@#"
app.use(cors({
  origin: ["http://localhost:3000", "https://espacito.netlify.app"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
}));
// app.use(
//   cookiesession({
//     name:"session",
//     keys:["Esposito"],
//     maxAge:24*60*60*100
//   })
// )
// app.use(passport.initialize())
// app.use(passport.session())
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
//-------------------------database connectio
mongoose
  .connect("mongodb+srv://sriharidinesh77:Asdfg123@cluster0.supo9kq.mongodb.net/foodapp?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

//-----------------------------------------------mongo admin

app.use(express.json());
const Food = require('./model/Food');





//getting category
const catschema=new mongoose.Schema({
  catname:String,
})
const category=mongoose.model('type',catschema)

app.post('/getalldata', async (req, res) => {
  try {
    // Use the Mongoose find method to retrieve all documents from the collection
    const allData = await Food.find();
    const allDatacat = await category.find();
    console.log("thhis is called")
    // Combine the data into a single object
    const combinedData = {
      foodData: allData,
      categoryData: allDatacat
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.use(express.json()); 


const { body, validationResult } = require('express-validator');
const User = require('./model/User');

app.post("/createuser", [
  body('email').isEmail(),
  body('name').isLength({ min: 5 }),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email,
      location: req.body.geolocation || "",
      phone: req.body.phone
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//login starts
app.post("/loginuser", [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userRecord = await User.findOne({ email: req.body.email });

    if (!userRecord) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Email Address' }] });
    }
    const pwdcompare=await bcrypt.compare(req.body.password,userRecord.password)
    if (!pwdcompare) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] });
    }
      const data={
        user:{
          id:userRecord.id
      }
      }
      const phonenumber=userRecord.phone
      const authtoken=jwt.sign(data,jwtSecret)
      res.json({ success: true, authtoken:authtoken,number:phonenumber });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

////userorders
const Orders = require('./model/Orders');
app.post('/orderedData',async(req,res)=>{
  let data=req.body.order_data
  const currentDate = new Date();
    
    // Extract date and time components
    const year = currentDate.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const date = ('0' + currentDate.getDate()).slice(-2); // Add leading zero if needed
    const hours = ('0' + currentDate.getHours()).slice(-2); // Add leading zero if needed
    const minutes = ('0' + currentDate.getMinutes()).slice(-2); // Add leading zero if needed
    const seconds = ('0' + currentDate.getSeconds()).slice(-2); // Add leading zero if needed
    
    // Construct the order ID
    const orderId = `${year}${month}${date}${hours}${minutes}${seconds}${req.body.phonenumber.slice(-4)}`;
    console.log(orderId)
  await data.splice(0, 0, {
    Order_date: req.body.order_date,
    status: "Preparing",
    number:req.body.phonenumber,
    Order_Id:orderId,
    Total_price:req.body.Total_Price
  });
  let emid=await Orders.findOne({'email':req.body.email})
  if(emid===null){
    try {
      await Orders.create({
        email:req.body.email,
        orderdata:[data]
      })
    } catch (error) {
      console.log(error)
    }
  }
  else{
    try {
      console.log("it is old")
      await Orders.findOneAndUpdate({email:req.body.email},
        {
          $push:{orderdata:data}}).then(()=>{
            res.json({success:true})
          })
    } catch (error) {
      console.log(error)
    }
  }
})

app.post('/myorderedData', async (req, res) => {
  
  try {
    const mydata = await Orders.findOne({ email: req.body.email });
    res.json({ Orderdata: mydata || [] });
  } catch (error) {
    console.error('Error fetching my order data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//forget password
app.post('/checkphone', async (req, res) => {
  try {
    const mydata = await User.find({ phone: req.body.phone });
    console.log("here1");
    if (mydata.length > 0) {
      res.status(200).send("Valid Number");
    } else {
      res.status(200).send("Invalid Number");
    }
  } catch (error) {
    console.error('Error fetching my order data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//update password
app.post('/updatepass', async (req, res) => {
  try {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashedPassword)
    await User.updateOne(
      {phone: req.body.Phone},
      {$set:{
        password: hashedPassword,
      }}
    )
    res.status(201).json({success: true, message: 'success' });
  } catch (error) {
    console.error('Error fetching my order data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
