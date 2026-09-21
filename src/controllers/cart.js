import cartModel from "../models/cart.js";
import ProductModel from "../models/product.js";
export const addCartItem = async(req,res) => {
    try {
        const userId = req.user.id
        const {productId, quantity} = req.body
        if(quantity < 1){
            return res.status(400).json({success: false, message: 'Số lượng phải lớn hơn 0'})
        }
        if(!productId || !quantity) {
            return res.status(400).json({success: false, message: 'Thiếu thông tin'})
        }
        const product = await ProductModel.findById(productId)
        if(!product) {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm'})
        }
        if(product.isActive === false) {
            return res.status(404).json({success: false, message: 'Sản phẩm đã ngừng hoạt động'})
        }
        if(product.stock < quantity) {
            return res.status(409).json({success: false, message: 'Số lượng không được lớn hơn hàng tồn kho'})
        }
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            const newCart = await cartModel.create({customer: userId, items: [{product: productId, quantity: quantity}]})
            return res.status(200).json({success: true, message: 'Thêm thành công', data:newCart})
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if(existingItemIndex !== -1) {
            if(cart.items[existingItemIndex].quantity + quantity > product.stock) {
                return res.status(409).json({success: false, message: 'Số lượng không được lớn hơn hàng tồn kho'})
            }
            cart.items[existingItemIndex].quantity += quantity
            await cart.save()
            return res.status(200).json({success: true, message: 'Thêm thành công', data:cart})
        }
        if (existingItemIndex === -1) {
            cart.items.push({product: productId, quantity: quantity})
            await cart.save()
            return res.status(200).json({success: true, message: 'Thêm thành công', data:cart})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lỗi Server'})    
    }
}

export const getCart = async(req,res) => {
    try {
        const userId = req.user.id
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            return res.status(404).json({success: false, message: 'Không tìm thấy giỏ hàng'})   
        }
        await cart.populate('items.product', 'name price')
        return res.status(200).json({success: true, message: 'Thêm thành công', data:cart})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lỗi Server'})    
    }
}

export const updateCartItem = async(req,res) => {
    try {
        const userId = req.user.id
        const productId = req.params.productId
        const quantity = req.body.quantity
        if(quantity < 1){
            return res.status(400).json({success: false, message: 'Số lượng phải lớn hơn 0'})    
        }
        if(!productId || !quantity) {
            return res.status(400).json({success: false, message: 'Thiếu thông tin'})    
        }
        const product = await ProductModel.findById(productId)
        if(!product) {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm'})    
        }
        if(product.isActive === false) {
            return res.status(404).json({success: false, message: 'Sản phẩm đã ngừng hoạt động'})
        }
        if(product.stock < quantity) {
            return res.status(409).json({success: false, message: 'Số lượng không được lớn hơn hàng tồn kho'})    
        }
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            return res.status(404).json({success: false, message: 'Không tìm thấy giỏ hàng'})    
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if(existingItemIndex !== -1) {
            cart.items[existingItemIndex].quantity = quantity
            await cart.save()
            return res.status(200).json({success: true, message: 'Cập nhật thành công', data:cart})
        }
        if (existingItemIndex === -1) {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng'})   
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lỗi Server'})    
    }
}

export const deleteCartItem = async(req,res) => {
    try {
        const userId = req.user.id
        const productId = req.params.productId
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            return res.status(404).json({success: false, message: 'Không tìm thấy giỏ hàng'})    
        }
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if(existingItemIndex !== -1) {
            cart.items.splice(existingItemIndex, 1)
            await cart.save()
            return res.status(200).json({success: true, message: 'Xóa thành công', data:cart})
        }
        if (existingItemIndex === -1) {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng'})   
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lỗi Server'})    
    }
}

export const clearCart = async(req,res) => {
    try {
        const userId = req.user.id
        const cart = await cartModel.findOne({customer: userId})
        if(!cart) {
            return res.status(404).json({success: false, message: 'Không tìm thấy giỏ hàng'})    
        }
        cart.items = []
        await cart.save()
        return res.status(200).json({success: true, message: 'Xóa thành công', data:cart})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lỗi Server'})    
    }
}