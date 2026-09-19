import express from 'express';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
const app = express();

app.use(express.json());
app.get('/api/health',(req,res) => {
    res.status(200).json({success: true,message: 'OrderFlow API is running'});
});
app.use('/auth', authRoutes);
app.use('/products', productRoutes)
export default app;