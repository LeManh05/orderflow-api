import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) => {
    try {
        const authHeader = req.headers['authorization']
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({success: false, message: 'Không có token'})    
        }
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode
            next()
        }else {
            return res.status(401).json({success: false, message: 'Thiếu Authorization Header hoặc sai định dạng Bearer'})    
        }
    } catch (error) {
        return res.status(401).json({success: false, message: 'Token không hợp lệ'})
    }
}
export default authMiddleware