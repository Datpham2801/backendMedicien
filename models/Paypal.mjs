import Medicine from "../models/Medical.mjs"; // Import MedicineSchema
import Medical from "../models/Medical.mjs"; // Import MedicalSchema
import PayPal from "../models/PayPal.mjs"; // Import PayPalSchema (nếu có)

const doctorController = {
  prescription: async (req, res) => {
    const idPatient = req.params.id;
    const idDoctor = req.params.id;
    const idNurse = req.body.idNurse;

    try {
      const { symptom, medicineName } = req.body; // Đảm bảo rằng bạn có tên thuốc và triệu chứng từ req.body
      // Tìm thông tin thuốc dựa trên tên
      const selectedMedicine = await Medicine.findOne({ name: medicineName });

      if (!selectedMedicine) {
        return res.status(404).json({ message: "Không tìm thấy thuốc" });
      }

      // Tìm thông tin bệnh nhân qua mô hình Medical (có trạng thái true)
      const medicalInfo = await Medical.findOne({ idPatient: idPatient, status: true });

      if (!medicalInfo) {
        return res.status(404).json({ message: "Không tìm thấy thông tin bệnh nhân" });
      }

      // Thêm thông tin đơn thuốc trực tiếp vào schema của bệnh nhân
      medicalInfo.idDoctor = idDoctor;
      medicalInfo.idNurse = idNurse;
      medicalInfo.symptom = symptom;

      // Thêm thuốc vào mảng medicine của đơn khám bệnh
      medicalInfo.medicine.push(selectedMedicine._id); // Gán ID của thuốc từ MedicineSchema

      // Tính tổng tiền đơn thuốc bằng cách duyệt qua mảng medicine
      let totalMedicinePrice = 0;
      for (const medicineId of medicalInfo.medicine) {
        const medicine = await Medicine.findById(medicineId);
        if (medicine) {
          totalMedicinePrice += medicine.price;
        }
      }

      // Gán tổng tiền vào trường tổng tiền của đơn khám bệnh
      medicalInfo.totalBill = totalMedicinePrice;

      // Lưu thông tin bệnh nhân
      const updatedMedicalInfo = await medicalInfo.save();

      // Tìm giá của thuốc từ bảng PayPal (nếu có)
      if (PayPal) {
        const paypalInfo = await PayPal.findOne({ medicine: selectedMedicine._id });
        if (paypalInfo) {
          // Lấy giá từ paypalInfo
          const medicinePrice = paypalInfo.price;

          // Tạo một đối tượng response để trả về kết quả với giá của thuốc
          const response = {
            ...updatedMedicalInfo.toObject(),
            medicinePrice: medicinePrice,
          };

          return res.status(200).json(response);
        }
      }

      // Nếu không tìm thấy thông tin giá, trả về kết quả mà không có giá
      res.status(200).json(updatedMedicalInfo);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};

export default doctorController;
