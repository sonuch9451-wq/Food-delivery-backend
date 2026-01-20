import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import {userModel} from '../models/userModel.js'


//Login User
const loginUser = async (req,res) =>{
const {email,password}= req.body
try {
    const user = await userModel.findOne({email});

    if(!user){
        return res.json({success:false,message:"User dose not exist"})
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.json({success:false, message: "Invalid credentials"})
    }

    const token = createToken(user._id);
    res.json({success:true,token})
} catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
}
}

const createToken = (id) => {
    console.log('🔑 Creating token with JWT_SECRET:', process.env.JWT_SECRET);
    console.log('👤 User ID for token:', id);
    const token = jwt.sign({id}, process.env.JWT_SECRET);
    console.log('✅ Token created:', token);
    return token;
}

//Register User

const registerUser = async (req,res) =>{
const {name,password,email} = req.body
try {
    const exist = await userModel.findOne({email})
    // Checking User Alredy exist
    if(exist){
        return res.json({success: false, message: "User alredy exist"})
    }

    //Validating Email format & strong password 
    if(!validator.isEmail(email)){
        return res.json({success: false, message: "Please enter valid email"})
    }

    if(password.length<8){
        return res.json({success:false, message: "Please enter strong password maximum eight number"})
    }

    //hasing user password

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password,salt)

    const newUser = new userModel({
        name:name,
        email:email,
        password:hashPassword
    })

    const user = await newUser.save()
    const token = createToken(user._id)
    res.json({success:true, token})
} catch (error) {
    console.log(error);
    res.json({success:false, message: "Error"})
    
}
}


export {registerUser,loginUser}