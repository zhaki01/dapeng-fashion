// 引入 mongoose 库，用于操作 MongoDB 数据库
const mongoose = require("mongoose");

// 定义一个异步函数，用来连接 MongoDB 数据库
const connectDB = async () => {
  try {
    // 尝试连接数据库，连接地址从环境变量中读取（通常在 .env 文件中配置 MONGO_URI）
    await mongoose.connect(process.env.MONGO_URI);

    // 如果连接成功，打印提示信息到控制台
    console.log("✅ MongoDB 数据库连接成功");
  } catch (err) {
    // 如果连接失败，打印错误信息到控制台
    console.error("❌ MongoDB 数据库连接失败：", err);

    // 强制退出程序，返回错误状态码 1，表示异常终止
    process.exit(1);
  }
};

// 将这个连接数据库的函数导出，方便在其他文件中调用
module.exports = connectDB;
