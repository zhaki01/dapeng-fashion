// server.js
// 📁 项目主服务器文件（后端入口）
// 说明：该文件负责启动 Express 服务，连接数据库，注册所有后端接口路由

// ✅ 引入依赖模块
const express = require("express"); // Node.js Web 框架
const cors = require("cors"); // 用于处理跨域请求
const dotenv = require("dotenv"); // 加载 .env 环境变量配置
const connectDB = require("./config/db"); // 自定义函数：连接 MongoDB 数据库

// ✅ 引入各个功能模块的路由（模块化结构）
const userRoutes = require("./routes/userRoutes"); // 用户注册/登录/信息
const productRoutes = require("./routes/productRoutes"); // 商品相关接口（用户端）
const cartRoutes = require("./routes/cartRoutes"); // 购物车功能
const checkoutRoutes = require("./routes/checkoutRoutes"); // 结算流程接口
const orderRoutes = require("./routes/orderRoutes"); // 订单接口（用户端）
const uploadRoutes = require("./routes/uploadRoutes"); // 上传图片接口（用于 Cloudinary）
const subscribeRoute = require("./routes/subscribeRoute"); // 邮箱订阅接口
const adminRoutes = require("./routes/adminRoutes"); // 后台用户管理
const productAdminRoutes = require("./routes/productAdminRoutes"); // 后台商品管理
const adminOrderRoutes = require("./routes/adminOrderRoutes"); // 后台订单管理
const favoriteRoutes = require("./routes/favoriteRoutes"); // 收藏夹功能接口
const historyRoutes = require("./routes/historyRoutes"); // 浏览记录接口

// ✅ 创建 Express 应用对象
const app = express();

// ✅ 中间件设置
app.use(express.json()); // 解析 JSON 格式请求体
app.use(cors()); // 允许前端跨域请求（例如 React/Vue 项目访问此服务）

// ✅ 加载环境变量（从 .env 文件中）
dotenv.config();

// ✅ 设定后端监听端口，优先使用环境变量中的 PORT，否则默认 3000
const PORT = process.env.PORT || 3000;

// ✅ 连接 MongoDB 数据库
connectDB();

// ✅ 根路径测试接口（可用于健康检查）
app.get("/", (req, res) => {
  res.send("WELCOME API!"); // 访问根路径时返回的响应内容
});

// ✅ 注册 API 路由（前台模块）
app.use("/api/users", userRoutes); // 用户接口（注册、登录、获取信息）
app.use("/api/products", productRoutes); // 商品查询、筛选、详情等
app.use("/api/cart", cartRoutes); // 购物车操作（增删改查）
app.use("/api/checkout", checkoutRoutes); // 结算操作（地址、支付等）
app.use("/api/orders", orderRoutes); // 用户订单操作
app.use("/api/upload", uploadRoutes); // 上传图片（连接 Cloudinary）
app.use("/api", subscribeRoute); // 邮箱订阅功能（/api/subscribe）

// ✅ 注册 API 路由（后台模块）
app.use("/api/admin/users", adminRoutes); // 管理员管理用户
app.use("/api/admin/products", productAdminRoutes); // 管理员管理商品
app.use("/api/admin/orders", adminOrderRoutes); // 管理员管理订单

// ✅ 注册行为记录接口
app.use("/api/history", historyRoutes); // 用户浏览记录
app.use("/api/favorites", favoriteRoutes); // 用户收藏夹

// ✅ 启动服务器并监听指定端口
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
