// adminRoutes.js
// 管理员路由
// 该路由用于处理管理员相关的操作，如获取所有用户、添加新用户、更新用户信息和删除用户
const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @路由 GET /api/admin/users
// @描述 获取所有用户（仅限管理员）
// @权限 私有 / 管理员
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 POST /api/admin/users
// @描述 添加新用户（仅限管理员）
// @权限 私有 / 管理员
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "用户已存在" });
    }

    user = new User({
      name,
      email,
      password,
      role: role || "客户", // 默认角色为“客户”
    });

    await user.save();
    res.status(201).json({ message: "用户创建成功", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 PUT /api/admin/users/:id
// @描述 更新用户信息（姓名、邮箱、角色）
// @权限 私有 / 管理员
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    res.json({ message: "用户信息更新成功", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 DELETE /api/admin/users/:id
// @描述 删除用户
// @权限 私有 / 管理员
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "用户已删除" });
    } else {
      res.status(404).json({ message: "用户未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
