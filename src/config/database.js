import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối DB thành công');
    } catch (error) {
        console.log('Kết nối DB thất bại',error);
        throw error
    }
}
export default connectDB