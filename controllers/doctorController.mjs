import bcrypt from "bcrypt";
import Medicine from "../models/Medicine.mjs"; // Import MedicineSchema
import Medical from "../models/Medical.mjs"; // Import MedicalSchema
import PayPal from "../models/PayPal.mjs"; // Import PayPalSchema (nếu có)
import User from "../models/User.mjs";

const doctorController = {
  prescription: async (req, res) => {
    const idPatient = req.params.id;
    const idDoctor = req.params.id;

    try {
      const { symptom, medicineName } = req.body; // Đảm bảo rằng bạn có tên thuốc và triệu chứng từ req.body
      // Tìm thông tin thuốc dựa trên tên
      const selectedMedicine = await Medicine.findOne({ name: medicineName });

      if (!selectedMedicine) {
        return res.status(404).json({ message: "Không tìm thấy thuốc" });
      }

      // Tìm thông tin bệnh nhân qua mô hình Medical (có trạng thái true)
      const medicalInfo = await Medical.findOne({
        idPatient: idPatient,
        status: true,
      });

      if (!medicalInfo) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy thông tin bệnh nhân" });
      }

      // Thêm thông tin đơn thuốc trực tiếp vào schema của bệnh nhân

      medicalInfo.symptom = symptom;
      medicalInfo.medicine = selectedMedicine._id; // Gán ID của thuốc từ MedicineSchema

      // Lưu thông tin bệnh nhân
      const updatedMedicalInfo = await medicalInfo.save();

      // Tìm giá của thuốc từ bảng PayPal (nếu có)
      // if (PayPal) {
      //   const paypalInfo = await PayPal.findOne({ medicine: selectedMedicine._id });
      //   if (paypalInfo) {
      //     // Lấy giá từ paypalInfo
      //     const medicinePrice = paypalInfo.price;

      //     // Tạo một đối tượng response để trả về kết quả với giá của thuốc
      //     const response = {
      //       ...updatedMedicalInfo.toObject(),
      //       medicinePrice: medicinePrice,
      //     };

      //     return res.status(200).json(response);
      //   }
      // }

      // Nếu không tìm thấy thông tin giá, trả về kết quả mà không có giá
      res.status(200).json(updatedMedicalInfo);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  registerDoctor: async (req, res) => {
    try {
      const message = [];
      const existingUser = await User.findOne({
        $or: [{ username: req.body.username }],
      });
      if (existingUser) {
        message.push("Tên người dùng hoặc số điện thoại đã tồn tại.");
      }
      if (message.length > 0) {
        return res.status(400).json({ message });
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashed,
        phone: req.body.phone,
        role: "doctor",
        avatar: req.file.path,
        name: req.body.name,
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },
};

export default doctorController;
