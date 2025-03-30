const mongoose = require("mongoose");

// 连接数据库的异步函数
const connectDB = async () => {
  try {
    // 尝试连接 MongoDB 数据库，地址从环境变量读取
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB 数据库连接成功");
  } catch (err) {
    console.error("❌ MongoDB 数据库连接失败：", err);
    process.exit(1); // 退出程序
  }
};

module.exports = connectDB;
