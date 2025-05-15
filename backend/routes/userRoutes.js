// userRoutes.js
// 📁 用户功能接口路由模块
// 说明：该文件用于实现用户的注册、登录、获取当前登录用户信息等操作

const express = require("express");
const User = require("../models/User"); // 用户数据模型
const jwt = require("jsonwebtoken"); // 用于生成和验证登录令牌（JWT）
const { protect } = require("../middleware/authMiddleware"); // 中间件：验证用户是否已登录
const router = express.Router(); // 创建路由对象

// 🟡 用户注册接口
// 方法：POST
// 地址：/api/users/register
// 权限：公开（任何用户都可以访问）
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body; // 获取前端提交的注册信息

  try {
    // 1️⃣ 查找该邮箱是否已注册
    let user = await User.findOne({ email });

    // 如果存在，返回错误提示
    if (user) return res.status(400).json({ message: "该邮箱已经注册" });

    // 2️⃣ 创建新用户
    user = new User({ name, email, password }); // 密码会自动加密（在模型中设置）
    await user.save(); // 保存到数据库

    // 3️⃣ 生成 JWT 登录令牌（令牌中存储用户ID和角色）
    const payload = { user: { id: user._id, role: user.role } };

    // 4️⃣ 使用密钥签发 token，设定有效期为40小时
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // 注册成功后返回用户基本信息和登录 token
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("服务器错误"); // 服务器内部错误
  }
});

// 🟡 用户登录接口
// 方法：POST
// 地址：/api/users/login
// 权限：公开
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // 从请求体中提取邮箱和密码

  try {
    // 1️⃣ 查找邮箱对应的用户
    let user = await User.findOne({ email });

    // 如果用户不存在，返回错误
    if (!user) return res.status(400).json({ message: "邮箱或密码错误" });

    // 2️⃣ 验证密码是否匹配（调用用户模型中的 matchPassword 方法）
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "邮箱或密码错误" });

    // 3️⃣ 登录成功后生成 token
    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // 返回用户信息和登录令牌
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("服务器错误");
  }
});

// 🟡 获取当前登录用户信息
// 方法：GET
// 地址：/api/users/profile
// 权限：私有（需要登录）
router.get("/profile", protect, async (req, res) => {
  // protect 中间件会将当前用户信息附加到 req.user
  res.json(req.user); // 直接返回当前登录用户的信息
});

// 导出该路由模块供主程序使用
module.exports = router;
