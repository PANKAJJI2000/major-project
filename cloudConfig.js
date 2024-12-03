const cloudinary = require('cloudinary').v2;
const { model } = require('mongoose');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpeg", "jpg","avif", "pdf"] // supports promises as well
    },
  });
  module.exports={
    cloudinary,storage
  }