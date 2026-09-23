import OrderModel from "../models/order.js"
import cartModel from "../models/cart.js"
import ProductModel from "../models/product.js"
export const createOrder = async(req,res,next) => {
    try {
        const userId = req.user.id
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            return res.status(404).json({success: false, message: 'Giỏ hàng không tồn tại'})
        }
        if(cart.items.length === 0){
            return res.status(409).json({success: false, message: 'Giỏ hàng trống'})    
        }
        for (const item of cart.items) {
            const product = await ProductModel.findById(item.product)
            if(!product){
                return res.status(404).json({success: false, message: 'Sản phẩm không tồn tại'})  
            }
            if(product.isActive === false){
                return res.status(404).json({success: false, message: 'Sản phẩm đã ngừng hoạt động'})   
            }
            if(product.stock < item.quantity){
                return res.status(409).json({success: false, message: 'Số lượng không được lớn hơn hàng tồn kho'})   
            }
        }
        const orderItems  = []
        for(const item of cart.items) {
            const product = await ProductModel.findById(item.product)
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            })
        }
        const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
        const order = new OrderModel({
            customer: userId,
            items: orderItems,
            totalPrice: totalPrice
        })
        await order.save()
        for(const item of order.items) {
            const product = await ProductModel.findById(item.product)
            product.stock -= item.quantity
            await product.save()
        }
        await cartModel.deleteOne({customer: userId})
        return res.status(201).json({success: true, message: 'Đặt hàng thành công', data:order})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Đặt hàng thất bại'})
    }
}