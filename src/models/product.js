import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    isActive: {type: Boolean, default: true},
 },
 {
    timestamps:true
 }
)


const ProductModel = mongoose.model('products', productSchema)
export default ProductModel