// uploadRoutes.js 文件中，我们将实现上传图片的接口。我们将使用 Multer 中间件来处理文件上传，然后使用 streamifier 将文件缓冲区转为流，最后通过 Cloudinary 的 upload_stream 方法将文件流上传至 Cloudinary。
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

const router = express.Router();

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 使用内存存储配置 Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 上传图片接口
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "未上传文件" });
    }

    // 将文件缓冲区通过流上传至 Cloudinary
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        // 使用 streamifier 将缓冲区转为流
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // 返回图片 URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
// 以上代码中，我们使用了 Multer 中间件来处理文件上传，然后使用 streamifier 将文件缓冲区转为流，最后通过 Cloudinary 的 upload_stream 方法将文件流上传至 Cloudinary。最后，我们返回了上传成功后的图片 URL。
