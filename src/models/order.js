import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items:[
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending','confirmed','shipping','completed','cancelled'],
        default: 'pending'
    }
}, {
    timestamps:true
})
const OrderModel = mongoose.model('order',orderSchema)
export default OrderModel