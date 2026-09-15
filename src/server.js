import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";


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