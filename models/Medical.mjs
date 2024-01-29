import mongoose from "mongoose";

const MedicalSchema = mongoose.Schema(
  {
    idPatient: {
      type: String,
      required: true,
    },
    symptom: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    idDoctor: {
      type: String,
    },
    idNurse: {
      type: String,
    },
    namePatient: {
      type: String,
    },
    medicine: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    diagnostic: {
      type: String,
    },
    totalBill: {
      type: Number,
    },
    advice: {
      type: String,
    },
    timeBook: {
      type: String,
    },
    isExamination: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Medical", MedicalSchema);
