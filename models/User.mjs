import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
      
      },
      username: {
        type: String,
        unique: true,
        minLength: 3,
        maxLength: 30,
      },
      phone: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 11,
        
      },
      password: {
        type: String,
        required: true,
        minLength: 6,
       
      },
      timework: [
        {
          day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          },
          hours: [
            {
              type: String
            }
          ]
        }
      ],
      role: {
        type: String,
        required: true,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    
      avatar: {
        type: String, // Lưu đường dẫn hoặc tên tệp ảnh
      },
      des : {
        type: String, // Lưu đường dẫn hoặc tên tệp ảnh
      },
      name : {
        type : String
      }
    },
    { timestamps: true }
  );

export default mongoose.model('User', userSchema);