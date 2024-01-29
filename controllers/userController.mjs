import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import Medical from "../models/Medical.mjs";
import nodemailer from "nodemailer";
const userController = {
  getAllusers: async (req, res) => {
    try {
      const user = await User.find().sort({ createdAt: -1 });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Xoa thanh cong");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getOneuser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateUser: async (req, res) => {
    try {
      const { email, phone, des, username, name, role } = req.body;

      // Check if a file was uploaded
      if (req.file) {
        // If a file was uploaded, update the avatar path
        req.body.avatar = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { username, email, phone, des, role, name, avatar: req.body.avatar },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  registerMedical: async (req, res) => {
    try {
      // Lấy thông tin từ request
      const { namePatient, email, totalBill, idDoctor, symptom, timeBook } =
        req.body;

      // Tạo và lưu bản ghi mới
      const newMedical = new Medical({
        idPatient: req.params.idPatient,
        namePatient,
        totalBill,
        idDoctor,
        symptom,
        timeBook,
      });
      const medical = await newMedical.save();

      // Cấu hình nodemailer
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "datpham28012001@gmail.com",
          pass: "zrsy dmeb scks vcik",
        },
      });

      // Cấu hình thông tin email
      let mailOptions = {
        from: "datpham28012001@gmail.com",
        to: email, // Sử dụng email nhận từ request
        subject: "Đăng ký lịch khám bệnh thành công",
        html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #4A90E2;">Thông tin đăng ký khám bệnh</h1>
      <p><strong>Tên bệnh nhân:</strong> ${namePatient}</p>
      <p><strong>Triệu chứng:</strong> ${symptom}</p>
      <p><strong>Tổng cộng:</strong> ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalBill)}</p>
      <p><strong>Thời gian đặt lịch:</strong> ${timeBook}</p>
      <p>Cảm ơn bạn đã tin tưởng và đặt lịch hẹn. Chúng tôi mong được gặp lại bạn!</p>
      <p>Có bất kì thắc mắc hay thay đổi gì vui lòng liên hệ hotline 0399289553.</p>
      
    </div>
    `,
      };

      // Gửi email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error sending email: " + error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.status(200).json(medical);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },

  updateUserTimework: async (req, res) => {
    const { userId } = req.params; // Lấy ID của người dùng từ URL
    const { timework } = req.body; // Lấy dữ liệu timework từ body của yêu cầu

    try {
      // Tìm người dùng theo ID và cập nhật
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { timework: timework },
        { new: true } // Tùy chọn này trả về đối tượng sau khi được cập nhật
      );

      if (!updatedUser) {
        return res.status(404).send("User not found");
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send("Error updating timework: " + error.message);
    }
  },
  addUser: async (req, res) => {
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
      const hashed = await bcrypt.hash("123456", salt);
      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashed,
        phone: req.body.phone,
        role: req.body.role,
        avatar: req.file.path,
        name: req.body.name,
      });
      console.log(req.body);
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },
};
export default userController;
