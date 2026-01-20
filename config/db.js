import mongoose from "mongoose";


 export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sc763894_db_user:1BCFOjBJiO6Hd0jw@cluster0.wsaajkl.mongodb.net/food-del', {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    }).then(()=>console.log("DB Connected")).catch(err => console.log("DB Connection Error:", err));
}