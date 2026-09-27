import OrderModel from "../models/order.js"
import cartModel from "../models/cart.js"
import ProductModel from "../models/product.js"
export const createOrder = async(req,res) => {
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
                return res.status(409).json({success: false, message: 'Sản phẩm đã ngừng hoạt động'})   
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

export const updateStatusOrder = async(req,res,next) => {
    try {
        const id = req.params.id
        const status = req.body.status
        const order = await OrderModel.findById(id)
        if(!order){
            return res.status(404).json({success:false, message: 'Không tìm thấy đơn hàng'})
        }
        const enumValidStatus = ['pending','confirmed','shipping','completed','cancelled']
        if(!enumValidStatus.includes(status)) {
            return res.status(400).json({success:false, message: 'Trạng thái không hợp lệ'})
        }
        if(order.status === 'pending'  && status === 'confirmed'){
            order.status = status
            await order.save()
            return res.status(200).json({success:true, message: 'Cập nhật thành công', data: order})
        }else if(order.status === 'confirmed'  && status === 'shipping'){
            order.status = status
            await order.save()
            return res.status(200).json({success:true, message: 'Cập nhật thành công', data: order})
        }else if(order.status === 'shipping'  && status === 'completed'){
            order.status = status
            await order.save()
            return res.status(200).json({success:true, message: 'Cập nhật thành công', data: order})
        }else{
            return res.status(400).json({success:false, message: 'Cập nhật thất bại'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Cập nhật thất bại'})
    }
}

export const cancelOrder = async(req,res,next) => {
    try {
       const userId = req.user.id
       const orderId = req.params.id
       const order = await OrderModel.findById(orderId)
        if(!order){
            return res.status(404).json({success:false, message: 'Không tìm thấy đơn hàng'})
        }
        if(userId.toString() !== order.customer.toString()) {
            return res.status(403).json({success:false, message: 'Không có quyền hủy đơn hàng'})
        }
        if(order.status !== 'pending') {
            return res.status(400).json({success:false, message: 'Đơn hàng không thể hủy'})
        }
        for(const item of order.items) {
            const product = await ProductModel.findById(item.product)
            product.stock += item.quantity
            await product.save()
        }
        order.status = 'cancelled'
        await order.save()
        return res.status(200).json({success:true, message: 'Đã hủy đơn hàng', data: order})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Hủy thất bại'})
    }
}

export const getMyOrders = async(req,res,next) => {
    try {
        const userId = req.user.id
        const orders = await OrderModel.find({customer: userId})
        return res.status(200).json({success:true, message: 'Lấy đơn hàng thành công', data: orders})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lấy đơn hàng thất bại'})
    }
}

export const getOrderById = async(req,res,next) => {
    try {
        const userId = req.user.id
        const id = req.params.id
        const order = await OrderModel.findById(id)
        if(!order){
            return res.status(404).json({success:false, message: 'Không tìm thấy đơn hàng'})
        }
        if(userId.toString() !== order.customer.toString()) {
            return res.status(403).json({success:false, message: 'Không có quyền xem đơn hàng'})
        }
        return res.status(200).json({success:true, message: 'Lấy đơn hàng thành công', data: order})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lấy đơn hàng thất bại'})
    }
}

export const getAllOrders = async(req,res,next) => {
    try {
        const customer = req.query.customer
        const page = Number(req.query.page) || 1
        if(page < 1){
            return res.status(400).json({success:false, message: 'Số trang không hợp lệ'})
        }
        const limit = Number(req.query.limit) || 10
        if(limit < 1){
            return res.status(400).json({success:false, message: 'Số lượng không hợp lệ'})
        }
        const skip = (page - 1) * limit
        const status = req.query.status
        const fromDate = req.query.fromDate
        const toDate = req.query.toDate
        const filter = {}
        if(status){
            filter.status = status
        }
        if(customer){
            filter.customer = customer
        }
        if(fromDate && toDate){
            filter.createdAt = {$gte: new Date(fromDate), $lte: new Date(`${toDate}T23:59:59.999`)}
        }
        const totalOrder = await OrderModel.countDocuments(filter)
        const totalPage = Math.ceil(totalOrder / limit)
        const orders = await OrderModel.find(filter).skip(skip).limit(limit)
        return res.status(200).json({success:true, message: 'Lấy đơn hàng thành công', data: orders, pagination: {page, limit, totalOrder, totalPage}})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lấy đơn hàng thất bại'})
    }
}

export const getAdminOrderById = async(req,res,next) => {
    try {
        const id = req.params.id
        const order = await OrderModel.findById(id)
        if(!order){
            return res.status(404).json({success:false, message: 'Không tìm thấy đơn hàng'})
        }
        return res.status(200).json({success:true, message: 'Lấy đơn hàng thành công', data: order})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lấy đơn hàng thất bại'})
    }
}