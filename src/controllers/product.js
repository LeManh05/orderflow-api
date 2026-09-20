import ProductModel from "../models/product.js"

export const createProduct = async(req,res) => {
    try {
        const body = req.body
        if( !body.name || !body.price || !body.stock) {
            return res.status(400).json({success: false, message: 'Thiếu thông tin'})  
        }
        const productmodel = new ProductModel(body)
        const products = await productmodel.save()
        res.status(201).json({success: true, message: 'Tạo thành công', data:products})
    } catch (error) {
        res.status(500).json({success: false, message: 'Tạo thất bại',})
    }
} 

export const getAllProducts = async(req,res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const search = req.query.search || ''
        const minPrice = req.query.minPrice || 0
        const maxPrice = req.query.maxPrice || 0
        let sort = req.query.sort || ''
        sort = sort === 'price_desc' ? {price: -1} : sort === 'price_asc' ? {price: 1} : {createdAt: -1}
        const filter = {}
        if(search) {
            filter.name = {$regex: search, $options: 'i'}
        }
        if(minPrice || maxPrice) {
            filter.price = {}
            if(minPrice) filter.price.$gte = minPrice
            if(maxPrice) filter.price.$lte = maxPrice
        }
        const skip = (page - 1) * limit
        const products = await ProductModel.find(filter).sort(sort).skip(skip).limit(limit)
        res.status(200).json({success: true, message: 'Lấy thành công', data:products})
    } catch (error) {
        res.status(500).json({success: false, message: 'Lấy thất bại',})
    }
}

export const getProductById = async(req,res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        if(product) {
            return res.status(200).json({success: true, message: 'Lấy thành công', data:product})
        }else {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Lấy thất bại',})
    }
}

export const updateProduct = async(req,res) => {
    try {
        const body = req.body
        const id = req.params.id
        const product = await ProductModel.findById(id)
        if(product) {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id,body,{new:true})
            return res.status(200).json({success: true, message: 'Cập nhật thành công', data:updatedProduct})
        }else {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Cập nhật thất bại',})
    }
}

export const deleteProduct = async(req,res) => {
    try {
        const id = req.params.id
        const product = await ProductModel.findById(id)
        if(product) {
            const deleteProduct = await ProductModel.findByIdAndDelete(id)
            return res.status(200).json({success: true, message: 'Xóa thành công', data:deleteProduct})
        }else {
            return res.status(404).json({success: false, message: 'Không tìm thấy sản phẩm'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Xóa thất bại',})
    }
}