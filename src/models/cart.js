import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   customer: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
       unique: true
   },
   items: [
   {
   product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    }
   ]
})
const cartModel = mongoose.model('Cart', cartSchema)
export default cartModel