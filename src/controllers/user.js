import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const Register = async (req,res) => {
    try {
        const {name, email, password} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({success: false, message: 'Thiếu thông tin'})
        }
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409).json({success: false, message: 'Email đã tồn tại'})
        }
        const hashPassword = await bcrypt.hash(password,10);
        const usermodel = new UserModel({name, email, password: hashPassword});
        await usermodel.save();
        res.status(201).json({success: true, message: 'Đăng ký thành công'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Đăng ký thất bại'})
    }
}

export const Login = async (req,res) => {
    try {
        const {email,password} = req.body
        if(!email || !password) {
            return res.status(400).json({success: false, message: 'Thiếu thông tin'})
        }
        const user = await UserModel.findOne({email});
        if(user === null) {
            return res.status(401).json({success: false, message: 'Email không tồn tại'})
        }else {
           const verify = await bcrypt.compare(password, user.password);
           if(verify) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.status(200).json({success: true, message: 'Đăng nhập thành công', token, user: {id: user._id, name: user.name, email: user.email}})
           }else {
            res.status(401).json({success: false, message: 'Sai tên đăng nhập hoặc mật khẩu'})
           }
        }
    } catch (error) {
        res.status(500).json({success: false, message: 'Đăng nhập thất bại'})
    }
}

export const GetMe = async(req,res) => {
    try {
        const user = await UserModel.findById(req.user.id)
        if(user) {
            return res.status(200).json({success: true, message: 'Thành công', user: {id: user._id, name: user.name, email: user.email}})
        }else {
            return res.status(404).json({success: false, message: 'Không tìm thấy user'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Thất bại'})
    }
}

export const AdminTest = (req,res) => {
    try {
        return res.status(200).json({success: true, message: 'Thành công'})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Thất bại'})
    }
}