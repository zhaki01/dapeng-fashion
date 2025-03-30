// userRoutes.js
// 用户路由
// 该路由用于处理用户注册、登录和获取用户信息的请求
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @route POST /api/users/register
// @desc 注册新用户
// @access 公共
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 注册逻辑
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "该邮箱已经注册" });

    user = new User({ name, email, password });
    await user.save();

    // 创建 JWT 载荷
    const payload = { user: { id: user._id, role: user.role } };

    // 签发并返回 token 以及用户数据
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

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
    res.status(500).send("服务器错误");
  }
});

// @route POST /api/users/login
// @desc 用户登录验证
// @access 公共
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 根据邮箱查找用户
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "邮箱或密码错误" });
    const isMatch = await user.matchPassword(password);

    if (!isMatch) return res.status(400).json({ message: "邮箱或密码错误" });

    // 创建 JWT 载荷
    const payload = { user: { id: user._id, role: user.role } };

    // 签发并返回 token 以及用户数据
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

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

// @route GET /api/users/profile
// @desc 获取当前用户信息（受保护）
// @access 私有
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
