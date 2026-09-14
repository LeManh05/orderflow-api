import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";


const connectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI);
       console.log('Kết nối DB thành công');
    } catch (error) {
       console.error('Kết nối thất bại', error);
       throw error;
    }
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT,()=>{
            console.log(`Server đang chạy ở cổng`, process.env.PORT);
        })
    } catch (error) {
        console.error('Server thất bại',error);
    }
}

startServer();