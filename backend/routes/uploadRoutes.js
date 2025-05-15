// uploadRoutes.js
// 📁 图片上传接口路由（用于前端上传图片）
// 本文件通过 Multer 中间件接收图片文件，使用 streamifier 将图片缓冲区转为流，
// 并使用 Cloudinary 的 upload_stream 方法将其上传到 Cloudinary 云图床平台，最后返回图片 URL

const express = require("express");
const multer = require("multer"); // 处理上传文件的中间件
const cloudinary = require("cloudinary").v2; // 云图片服务（用于存储图片）
const streamifier = require("streamifier"); // 用于将 Buffer 转换为可读流

require("dotenv").config(); // 加载 .env 配置文件中的环境变量

const router = express.Router(); // 创建 Express 路由对象

// ✅ 配置 Cloudinary 账号信息（从环境变量中读取）
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 云服务账号名
  api_key: process.env.CLOUDINARY_API_KEY, // API 密钥
  api_secret: process.env.CLOUDINARY_API_SECRET, // API 密钥
});

// ✅ 使用 Multer 内存存储（图片上传后暂存在内存中，而不是硬盘）
const storage = multer.memoryStorage();
const upload = multer({ storage }); // 创建上传中间件

// 🟡 路由：上传单张图片
// 方法：POST
// 地址：/api/upload
// 权限：公开接口（任何用户都可以上传）
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 校验：若未上传文件，返回错误提示
    if (!req.file) {
      return res.status(400).json({ message: "未上传文件" });
    }

    // ✅ 将文件缓冲区转为上传流并上传至 Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        // 调用 Cloudinary 的流式上传方法
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result); // 上传成功，返回结果
          } else {
            reject(error); // 上传失败，抛出错误
          }
        });

        // 使用 streamifier 将内存中的文件缓冲区转换为可上传的流，并发送到 Cloudinary
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // 执行上传，并获取上传结果
    const result = await streamUpload(req.file.buffer);

    // ✅ 上传成功后，返回图片的公开 URL（用于前端显示）
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    // 错误处理：如上传失败或服务器异常
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 导出路由模块，供主应用使用
module.exports = router;
