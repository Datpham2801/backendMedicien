import mongoose from "mongoose";

const MedicalRecordSchema = mongoose.Schema(
  {
    idPatient: {
      type: String,
      require: true,
    },
    idDoctor : {
      type: String,
    },
    idNurse : {
      type: String,
    },
    symptom: {
      type: String,
      require: true,
    },
    medicine: {
        type: mongoose.Schema.Types.ObjectId, // Tham chiếu đến MedicineSchema bằng ID
        ref: 'MedicineSchema' // Tên của mô hình bạn muốn tham chiếu
    },
  },
  { timestamps: true }
);
export default  mongoose.model('MedicalRecord', MedicalRecordSchema);
