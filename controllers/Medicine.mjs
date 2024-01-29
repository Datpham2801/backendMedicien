import MedicineSchema from "../models/Medicine.mjs";

const medicineController = {
  addMedicine: async (req, res) => {
    try {
      const existingMedicine = await MedicineSchema.findOne({
        $or: [{ name: req.body.name }],
      });
      if (existingMedicine) {
        res.status(400).json({
          message: "Thuốc đã tồn tại",
        });
      }

      const newMedicine = new MedicineSchema({
        name: req.body.name,
        price: req.body.price,
        image: req.file.path,
      });
      console.log(req.file);
      const medicine = await newMedicine.save();
      res.status(200).json(newMedicine);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
  getAllmedicine: async (req, res) => {
    try {
      const medicine = await MedicineSchema.find();
      res.status(200).json(medicine);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMedicine: async (req, res) => {
    try {
      const medicine = await MedicineSchema.findByIdAndDelete(req.params.id);
      res.status(200).json("Xoa thanh cong");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getOnemedicine: async (req, res) => {
    try {
      const medicine = await MedicineSchema.findById(req.params.id);
      res.status(200).json(medicine);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateMediciner: async (req, res) => {
    try {
      const medicineId = req.params.id;
      const updateMedicine = {
        name: req.body.name,
        price: req.body.price,
        status: false,
      };

      // Kiểm tra xem một file mới có được tải lên hay không
      if (req.file) {
        updateMedicine.image = req.file.path;
      }

      const medicineToUpdate = await MedicineSchema.findById(medicineId);

      if (!medicineToUpdate) {
        return res.status(404).json({ message: "Không tìm thấy loại thuốc" });
      }

      // Cập nhật các trường khác
      Object.assign(medicineToUpdate, updateMedicine);

      // Cập nhật loại thuốc
      const updatedMedicine = await medicineToUpdate.save();
      res.status(200).json(updatedMedicine);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
export default medicineController;
