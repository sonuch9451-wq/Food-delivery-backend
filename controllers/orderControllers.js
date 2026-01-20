import { response } from "express";
import { orderModel } from "../models/orderModel.js";
import {userModel} from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order for frontend
const placeOrder = async (req,res) =>{
    console.log('🚀 BRAND NEW CODE IS RUNNING 🚀');
    const frontend_url = "http://localhost:5174"

    try {
        console.log('📦 Order data received:', req.body);
        console.log('👤 User ID:', req.body.userId);
        
        // Simple validation
        if(!req.body.userId) {
            console.log('❌ No user ID');
            return res.json({success:false, message:"No user authentication"});
        }
        
        if(!req.body.items || req.body.items.length === 0) {
            console.log('❌ No items');
            return res.json({success:false, message:"Cart is empty"});
        }
        
        console.log('✅ Creating Stripe payment...');
        
        // Create simple Stripe session
        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:Math.round(item.price*100)
            },
            quantity:item.quantity
        }))

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=new123`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=new123`,
        })
        
        console.log('✅ Stripe session created:', session.url);
        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log('💥 ERROR:', error.message);
        res.json({success:false, message:`NEW ERROR: ${error.message}`})
    }
}

const verifyOrder = async (req,res) =>{

    const {orderId,success} = req.body;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}

//user orders for frontend

const userOrders = async (req,res) =>{

    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({success: true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Error"})
    }

}

// Listing order for admin panel

const listOrders = async (req,res) =>{
  
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}

// API for updating status

const updateStatus = async (req,res) =>{

    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
        
    }

}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}