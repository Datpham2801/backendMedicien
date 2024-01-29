import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import authRoute from './routes/authRoute.mjs'
import userRoute from './routes/userRoute.mjs'
import medicineRoute from './routes/Medicine.mjs'
import nurseRoute from './routes/nurseRoute.mjs'
import doctorRoute from './routes/doctorRoute.mjs'
import VNpayRoute from './routes/VNpayRoute.mjs'
import medicalRoute from './routes/medicalRoute.mjs'
const app = express();
const port = 8000;
dotenv.config()

app.use(cors())
app.use(express.json())

app.use('/uploads' , express.static('uploads'))

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
  
  db.once("open", () => {
    console.log("MongoDB connected successfully!");
  });


app.use('/api/auth' , authRoute)  
app.use('/api/user' ,userRoute)
app.use('/api/medicine' , medicineRoute)
app.use('/api/nurse', nurseRoute)
app.use('/api/doctor' ,doctorRoute)
app.use('/api/vnpay' , VNpayRoute)
app.use('/api/medical' , medicalRoute)
app.listen(port , () => console.log(`Example app listening on port ${port}!`));
