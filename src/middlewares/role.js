import UserModel from "../models/user.js";
const roleMiddleware = (role) => async(req,res,next) => {
    try {
        if(!req.user) {
            return res.status(401).json({success: false, message: 'Không tìm thấy user'})    
        }
        const user = await UserModel.findById(req.user.id)
        if(!user) {
            return res.status(404).json({success: false, message: 'Không tìm thấy user'})    
        }
        if(user.role === role) {
            next()
        }else {
            return res.status(403).json({success: false, message: 'Không có quyền truy cập'})
        }
    } catch (error) {
        return res.status(500).json({success: false, message: 'Thất bại'})
    }
}
export default roleMiddleware