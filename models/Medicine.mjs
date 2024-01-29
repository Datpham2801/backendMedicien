import mongoose from "mongoose";

const MedicineSchema =  mongoose.Schema(
    {
        name :{
            type : String,
            required: true,
            unique: true,
        },
        price : {
            type : Number,
            required: true,
        },
        image : {
            type : String,
            required: true,
        }
    }
)
export default mongoose.model('MedicineSchema', MedicineSchema);