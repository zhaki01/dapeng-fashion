// File: backend/seeder.js
// 📁 数据填充脚本（Seeder）
// 说明：该脚本用于初始化数据库中的默认数据（如清空表、插入初始用户与商品等）
// 通常用于开发或测试阶段，快速生成可用的数据环境

// ✅ 引入所需模块
const mongoose = require("mongoose"); // 用于连接 MongoDB 数据库
const dotenv = require("dotenv"); // 用于加载 .env 文件中的环境变量
const Product = require("./models/Product"); // 商品模型
const User = require("./models/User"); // 用户模型
const Cart = require("./models/Cart"); // 购物车模型
const Checkout = require("./models/Checkout"); // 结算模型
const Order = require("./models/Order"); // 订单模型

const products = require("./data/products"); // 引入本地产品数据文件（JSON 数组）

dotenv.config(); // 加载 .env 配置（例如 MONGO_URI）

// ✅ 连接 MongoDB 数据库
mongoose.connect(process.env.MONGO_URI);

// ✅ 定义主函数：用于执行数据清除与插入任务
const seedData = async () => {
  try {
    // 🔄 第一步：清空已有的旧数据
    await Product.deleteMany(); // 清空所有商品
    await User.deleteMany(); // 清空所有用户
    await Cart.deleteMany(); // 清空购物车
    await Checkout.deleteMany(); // 清空结算信息
    await Order.deleteMany(); // 清空订单信息

    // ✅ 第二步：创建一个默认管理员用户
    const createdUser = await User.create({
      name: "Admin User", // 姓名
      email: "admin@example.com", // 邮箱
      password: "123456", // 密码（模型中应自动加密）
      role: "管理员", // 角色设置为管理员
    });

    // ✅ 第三步：为所有商品绑定创建者（user 字段）
    const userID = createdUser._id; // 获取刚创建的管理员用户ID

    // 遍历商品数组，为每个商品附加 user 字段（管理员ID）
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // ✅ 第四步：批量插入商品数据到数据库中
    await Product.insertMany(sampleProducts);

    // ✅ 最后：打印成功信息并退出进程
    console.log("Product data seeded successfully!");
    process.exit(); // 正常退出程序
  } catch (error) {
    // ❌ 如果发生错误，打印错误并以状态码 1 异常退出
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

// ✅ 执行函数
seedData();
