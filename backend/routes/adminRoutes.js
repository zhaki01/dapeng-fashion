// adminRoutes.js
// 管理员路由
// 该路由用于处理管理员相关的操作，如获取所有用户、添加新用户、更新用户信息和删除用户

const express = require("express"); // 引入 Express 框架
const User = require("../models/User"); // 引入 User 用户模型，用于操作数据库中的用户数据
const { protect, admin } = require("../middleware/authMiddleware");
// 引入中间件：protect 验证登录，admin 验证是否为管理员

const router = express.Router(); // 创建路由实例

// @路由 GET /api/admin/users
// @描述 获取所有用户（仅限管理员）
// @权限 私有 / 管理员
router.get("/", protect, admin, async (req, res) => {
  try {
    // 查询数据库中所有用户
    const users = await User.find({});
    // 返回用户数组
    res.json(users);
  } catch (error) {
    // 出现异常时返回服务器错误
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// @路由 POST /api/admin/users
// @描述 添加新用户（仅限管理员）
// @权限 私有 / 管理员
router.post("/", protect, admin, async (req, res) => {
  // 从请求体中获取新用户的基本信息
  const { name, email, password, role } = req.body;

  try {
    // 检查该邮箱是否已存在用户
    let user = await User.findOne({ email });
    if (user) {
      // 如果已存在，则返回 400 状态码和提示信息
      return res.status(400).json({ message: "用户已存在" });
    }

    // 创建新用户对象
    user = new User({
      name,
      email,
      password,
      role: role || "客户", // 如果没有指定角色，默认设置为“客户”
    });

    // 保存用户到数据库
    await user.save();

    // 返回创建成功的信息
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
    // 根据用户 ID 查找用户
    const user = await User.findById(req.params.id);
    if (user) {
      // 更新用户的字段（如未传入新值则保持原值）
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      // 保存更新后的用户信息
      const updatedUser = await user.save();

      // 返回更新结果
      res.json({ message: "用户信息更新成功", user: updatedUser });
    } else {
      // 若用户不存在
      res.status(404).json({ message: "用户未找到" });
    }
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
    // 根据用户 ID 查找用户
    const user = await User.findById(req.params.id);
    if (user) {
      // 删除该用户
      await user.deleteOne();

      // 返回成功信息
      res.json({ message: "用户已删除" });
    } else {
      // 用户不存在时提示
      res.status(404).json({ message: "用户未找到" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出该路由模块供主程序使用
module.exports = router;
