import UserModel from "../models/user.js";
import bcrypt from 'bcrypt';
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