import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food items

const addFood = async (req,res) =>{
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })

    try {
        await food.save();
        res.json({success:true, message: "Food Item Added"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }

}

// All Food List

const listFood = async (req,res) =>{
try {
    const foods = await foodModel.find({});
    res.json({success: true, data:foods})
} catch (error) {
    console.log(error);
    res.json({success: false, message: "error"})
    
}
}

// Remove Food Items

const removedFood = async (req,res) =>{
    try {
        // const food = await foodModel.findByIdAndDelete(req.params.id);
        const food = await foodModel.findById(req.body.id);     // this line find the food item by id
        fs.unlink(`uploads/${food.image}`,()=>{})               // this line delete the image from uploads folder
        await foodModel.findByIdAndDelete(req.body.id);         // this line delete the food item from database
        res.json({success: true, message: "Food Removed"})
    } catch (error) {
        console.log(error);
        
        res.json({success: false, message:"Error"})
    }
}

export {addFood,listFood,removedFood}