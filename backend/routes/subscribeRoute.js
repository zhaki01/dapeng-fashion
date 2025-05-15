// subscribeRouter.js
// 📁 邮件订阅功能接口
// 说明：该路由用于处理用户订阅电子报（Newsletter）的请求，例如填写邮箱后提交订阅

const express = require("express");
const router = express.Router(); // 创建 Express 路由对象
const Subscriber = require("../models/Subscriber"); // 引入订阅者数据模型

// 🟡 路由：提交订阅请求
// 方法：POST
// 地址：/api/subscribe
// 权限：公开（任何人都可以订阅，无需登录）
router.post("/subscribe", async (req, res) => {
  const { email } = req.body; // 从请求中获取邮箱地址

  // 校验：如果未填写邮箱，返回错误提示
  if (!email) {
    return res.status(400).json({ message: "请输入邮箱地址" });
  }

  try {
    // 检查数据库中是否已存在该邮箱的订阅记录
    let subscriber = await Subscriber.findOne({ email });

    // 如果已存在，则提示用户该邮箱已订阅
    if (subscriber) {
      return res.status(400).json({ message: "该邮箱已订阅" });
    }

    // 创建新的订阅记录
    subscriber = new Subscriber({ email });

    // 将订阅信息保存到数据库
    await subscriber.save();

    // 返回订阅成功的提示
    res.status(201).json({ message: "订阅成功，欢迎加入我们的邮件列表！" });
  } catch (error) {
    // 如果过程中出现错误，记录错误信息并返回服务器错误提示
    console.error(error);
    res.status(500).json({ message: "服务器错误，请稍后再试" });
  }
});

// 导出该路由模块，供主程序引入使用
module.exports = router;
