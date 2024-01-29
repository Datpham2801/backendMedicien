import Medical from "../models/Medical.mjs";
const nurseController = {
    getAllmedical : async (req , res) => {
      try {
        const medical = await Medical.find();
        res.status(200).json(medical);
      } catch (error) {
        res.status(500).json(error);
      }
    },
    updateMedical: async (req, res) => {
      const medicalId = req.params.id;
      const nurseId = req.body.idNurse;
      try {
        const updatedMedical = await Medical.findByIdAndUpdate(
          medicalId, 
          { status: true, idNurse: nurseId },
          { new: true } // Lấy bản ghi mới sau cập nhật
        );
          if (!updatedMedical) {
              return res.status(404).json({ message: "Không tìm thấy thông tin lịch khám bệnh" });
          }


          res.status(200).json(updatedMedical);
      } catch (error) {
          res.status(500).json({ message: error });
      }
  }
      
}
export default nurseController