import Medical from "../models/Medical.mjs";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import User from "../models/User.mjs";

import fs from "fs";
function formatISODateToCustom(isoDateStr) {
  const date = new Date(isoDateStr);

  // Định dạng giờ và phút
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Định dạng ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() trả về 0-11
  const year = date.getFullYear();

  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}

function createPDF(medicalData, pdfPath, doctorName, nurseName) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.font("./dejavu-sans/DejaVuSans.ttf");

  doc.fillColor("#0000FF");

  // Header
  doc.fontSize(16).text("PHÒNG KHÁM ISOPHCARE", { align: "center" });
  doc
    .fontSize(12)
    .text(
      "Địa chỉ: 105 Doãn Kế Thiện, Phường Mai Dịch, Quận Cầu giấy, Hà Nội",
      {
        align: "center",
      }
    );
  doc.moveDown();

  // Title
  doc.fontSize(18).text("KẾT QUẢ KHÁM BỆNH", { align: "center" });
  doc.moveDown(0.5);

  // Patient Information
  doc.fontSize(12).text(`Họ và tên bệnh nhân: ${medicalData.namePatient}`);
  doc.moveDown();

  // Medical Information
  doc.text("Thông tin chung:");
  doc.text(`Bác sĩ đảm nhận: ${doctorName.name}`);
  doc.text(`Lý do khám bệnh: ${medicalData.symptom}`);
  doc.text(`Chuẩn đoán của bệnh nhân: ${medicalData.diagnostic}`);
  doc.text(`Lời khuyên cho bệnh nhân: ${medicalData.advice}`);
  doc.text(
    `Thời gian khám bệnh: ${formatISODateToCustom(medicalData.updatedAt)}`
  );
  doc.moveDown();

  // Table - Danh sách thuốc
  let startX = 50;
  let startY = 280;
  const columnWidths = [100, 150, 100, 100];
  const rowHeight = 20;
  let totalCost = 0;

  // Thiết lập màu sắc viền
  doc.strokeColor("#0000FF");

  // Tiêu đề cột
  doc
    .fontSize(10)
    .text("Tên thuốc", startX, startY)
    .text("Số lượng", startX + columnWidths[0], startY)
    .text("Đơn giá", startX + columnWidths[0] + columnWidths[1], startY)
    .text(
      "Thành tiền",
      startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
      startY
    );

  medicalData.medicine.forEach((medicine, rowIndex) => {
    let currentY = startY + rowHeight * (rowIndex + 1);
    let cost = medicine.quantity * medicine.price;
    totalCost += cost;

    // Nội dung cột
    doc
      .fontSize(10)
      .text(medicine.name, startX, currentY)
      .text(medicine.quantity, startX + columnWidths[0], currentY)
      .text(
        `
        ${medicine.price.toLocaleString()} VND`,
        startX + columnWidths[0] + columnWidths[1],
        currentY,
        { align: "top" }
      )
      .text(
        `${cost.toLocaleString()} VND`,
        startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
        currentY
      );

    // Vẽ viền cho mỗi ô, bao gồm hàng cuối cùng
    columnWidths.forEach((width, columnIndex) => {
      let currentX =
        startX + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
      doc.rect(currentX, currentY - rowHeight, width, rowHeight).stroke();
    });
  });

  // Vẽ viền cho tất cả các hàng, bao gồm hàng cuối cùng
  if (medicalData.medicine.length > 0) {
    let lastRowIndex = medicalData.medicine.length - 1;
    let lastRowY = startY + rowHeight * (lastRowIndex + 1);

    // Vẽ viền cho hàng cuối cùng
    columnWidths.forEach((width, columnIndex) => {
      let currentX =
        startX + columnWidths.slice(0, columnIndex).reduce((a, b) => a + b, 0);
      doc.rect(currentX, lastRowY, width, rowHeight).stroke();
    });
  }

  // Tạo khoảng cách sau bảng trước khi hiển thị tổng tiền
  doc.moveDown(2);

  // Hiển thị tổng tiền
  doc
    .fontSize(12)
    .text(
      "Tổng tiền",
      startX,
      startY + rowHeight * (medicalData.medicine.length + 1)
    )
    .text(
      `${totalCost.toLocaleString()} VND`,
      startX + columnWidths[0] + columnWidths[1] + columnWidths[2],
      startY + rowHeight * (medicalData.medicine.length + 1)
    );

  doc
    .fontSize(12)
    .text(
      "Bệnh Nhân",
      startX,
      startY + rowHeight + 30 * (medicalData.medicine.length + 1)
    )
    .text(
      "Bác Sĩ",
      startX + 250,
      startY + rowHeight + 30 * (medicalData.medicine.length + 1)
    )
    .text(
      "Y Tá",
      startX + 450,
      startY + rowHeight + 30 * (medicalData.medicine.length + 1)
    );

  doc
    .fontSize(10)
    .text(
      `${medicalData.namePatient}`,
      startX,
      startY + rowHeight + 50 * (medicalData.medicine.length + 1)
    )
    .text(
      `${doctorName.name}`,
      startX + 250,
      startY + rowHeight + 50 * (medicalData.medicine.length + 1)
    )
    .text(
      `${nurseName.name}`,
      startX + 450,
      startY + rowHeight + 50 * (medicalData.medicine.length + 1)
    );

  // Tạo khoảng cách sau tổng tiền trước khi hiển thị footer
  doc.moveDown(2);
  doc.moveDown(0.5);
  // Footer

  doc
    .fontSize(12)
    .text(
      "Cảm ơn khách hàng đã đặt lịch tại phòng khám của chúng tôi  ",
      startX,
      startY + rowHeight + 70 * (medicalData.medicine.length + 1)
    );

  doc
    .fontSize(12)
    .text(
      "Mọi thắc mắc xin liên hệ 092323232",
      startX,
      startY + rowHeight + 75 * (medicalData.medicine.length + 1)
    );

  // Finalize PDF file
  doc.end();
}

// Example usage:
const medicalData = {
  namePatient: "PHẠM HỒU TÂM",
  birthDate: "30/04/1971",
  address: "99/1/2 Đường Lục Tỉnh, Phường 1, TP. Rạch Giá, Tỉnh Kiên Giang",
  email: "huutam@gmail.com",
  reasonForVisit: "Chóng mặt",
  diagnosis: "Chóng mặt và chịu ứng enalapril mà không sử dụng Thiazide",
  medicines: [
    { name: "Thuốc A", quantity: 2, price: 50000 },
    { name: "Thuốc B", quantity: 1, price: 30000 },
    // add more medicines as needed
  ],
};

async function sendEmailWithPDF(email, pdfPath) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "datpham28012001@gmail.com",
      pass: "zrsy dmeb scks vcik",
    },
  });

  let mailOptions = {
    from: "datpham28012001@gmail.com",
    to: email,
    subject: "Bản Ghi Y Tế Của Bạn",
    text: "Bản ghi y tế của bạn đính kèm dưới đây.",
    attachments: [
      {
        filename: "medicalRecord.pdf",
        path: pdfPath,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
async function generateDoctor(idDoctor) {
  const doctorData = await User.findById(idDoctor);
  return doctorData;
}

const MedicalController = {
  getAllMedical: async (req, res) => {
    try {
      const medical = await Medical.find().sort({ createdAt: -1 }); // Sắp xếp giảm dần theo trường createdAt
      res.status(200).json(medical);
      console.log(medical);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMedicalById: async (req, res) => {
    try {
      const medical = await Medical.findById(req.params.id);
      res.status(200).json(medical);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMedical: async (req, res) => {
    try {
      const medical = await Medical.findByIdAndDelete(req.params.id);
      res.status(200).json("Xoa thanh cong");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateMedical: async (req, res) => {
    try {
      // Tiến hành cập nhật với ID đã lấy được
      const medical = await Medical.findById(req.params.id);
      // Kiểm tra xem bản ghi y tế có tồn tại không
      if (!medical) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bản ghi y tế" });
      }
      // Cập nhật các trường dữ liệu tùy thuộc vào dữ liệu mới từ req.body
      if (req.body.diagnostic) {
        medical.diagnostic = req.body.diagnostic;
      }
      if (req.body.advice) {
        medical.advice = req.body.advice;
      }
      if (req.body.medicine && Array.isArray(req.body.medicine)) {
        medical.medicine = req.body.medicine;
      }
      await medical.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật bản ghi y tế thành công",
        updatedMedical: medical,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  downloadPDF: async (req, res) => {
    try {
      const medicalId = req.params.id;
      const medicalRecord = await Medical.findById(medicalId);
      if (!medicalRecord) {
        return res.status(404).send("Bản ghi y tế không tồn tại.");
      }

      // Tạo tên file dựa trên ID bản ghi y tế
      const pdfPath = `MedicalRecord-${medicalId}.pdf`;

      // Gọi hàm createPDF với đường dẫn file mới
      const doctocData = await generateDoctor(medicalRecord.idDoctor);
      const nurseData = await generateDoctor(medicalRecord.idNurse);
      createPDF(medicalRecord, pdfPath, doctocData, nurseData);

      // Đợi file PDF được tạo
      setTimeout(() => {
        res.download(pdfPath, (err) => {
          if (err) {
            res.status(500).send(err);
          }
          // Xóa file sau khi tải xuống để tránh rò rỉ thông tin
          fs.unlinkSync(pdfPath);
        });
      }, 2000); // Thời gian đợi có thể thay đổi tùy thuộc vào thời gian tạo file
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateMedicineQuantity: async (req, res) => {
    try {
      const medicalId = req.params.id;
      const { medicineUpdates } = req.body; // Dạng [{ name: 'MedicineName', quantity: newQuantity }, ...]

      const medicalRecord = await Medical.findById(medicalId);
      if (!medicalRecord) {
        return res.status(404).json({ message: "Bản ghi y tế không tồn tại." });
      }

      // Cập nhật số lượng thuốc
      const updatedMedicines = medicalRecord.medicine.map((med) => {
        const update = medicineUpdates.find(
          (update) => update.name === med.name
        );
        if (update) {
          return { ...med, quantity: update.quantity };
        }
        return med;
      });

      medicalRecord.medicine = updatedMedicines;
      medicalRecord.totalBill = req.body.totalBill;
      medicalRecord.isExamination = true;
      await medicalRecord.save();
      const doctocData = await generateDoctor(medicalRecord.idDoctor);
      const nurseData = await generateDoctor(medicalRecord.idNurse);
      const pdfPath = `MedicalRecord-${medicalRecord._id}.pdf`;
      createPDF(medicalRecord, pdfPath, doctocData, nurseData);
      await sendEmailWithPDF(req.body.email, pdfPath);
      res.status(200).json({
        message: "Cập nhật số lượng thuốc thành công.",
        updatedMedical: medicalRecord,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};
export default MedicalController;
