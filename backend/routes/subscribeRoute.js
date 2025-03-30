// subscribeRouter.js
// 订阅路由
// 该路由用于处理用户订阅电子报的请求
const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @路由 POST /api/subscribe
// @描述 处理订阅电子报请求
// @权限 公开
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "请输入邮箱地址" });
  }

  try {
    // 检查邮箱是否已订阅
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "该邮箱已订阅" });
    }

    // 新建订阅记录
    subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: "订阅成功，欢迎加入我们的邮件列表！" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误，请稍后再试" });
  }
});

module.exports = router;
