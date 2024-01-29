import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.mjs";
const authController = {
  registerUser: async (req, res) => {
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
        role: 'user',
        // avatar: req.file.path, 
      });
      console.log(req.body);
      const user = await newUser.save();
      res.status(200).json(user);
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("User không tồn tại");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!validPassword) {
        return res.status(401).json("Sai password");
      }
  
      const accessToken = jsonwebtoken.sign(
        {
          id: user.id,
          admin: user.admin,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "120m" }
      );
      
      const { password, ...other } = user._doc;
      res.status(200).json({ ...other, accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ." });
    }
  }
  
};
export default authController;



