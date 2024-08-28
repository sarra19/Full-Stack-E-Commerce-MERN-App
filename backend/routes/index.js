const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const deleteUserController = require('../controller/user/deleteUser');
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const payementController = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/order.controller')
const allOrderController = require('../controller/order/allOrder.controller')
const deleteProductController = require('../controller/product/deleteProductController')

const sendEmail = require('../sendEmail')
const userModel = require('../models/userModel')
const userVerifyController = require('../controller/user/userVerifyController')


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)
router.get("/:id/verify/:token/", userVerifyController)


//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.delete("/delete-user", authToken, deleteUserController);


//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.put("/update-product",updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.delete("/delete-product/:id", deleteProductController);

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",deleteAddToCartProduct)

//payement and order
router.post("/checkout", authToken, payementController);
router.post("/webhook", webhooks);
router.get("/order-list",authToken,orderController)
router.get("/all-order",authToken,allOrderController)
router.post('/password-reset/change', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required' });
      }
  
      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      // Send success response
      res.status(200).send({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).send({ error: 'Internal Server Error: ' + error.message });
    }
  });
  router.post("/password-reset/send_recovery_email", async (req, res) => {
    try {
      const { OTP, recipient_email } = req.body;
      if (!OTP || !recipient_email) {
        return res.status(400).send({ error: "OTP and recipient_email are required" });
      }
  
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Recovery</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #fdf0f6;
      color: #333;
    }
    .email-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #ff66b2;
      margin-bottom: 20px;
    }
    .email-header img {
      max-width: 200px;
      height: auto;
    }
    .email-content {
      text-align: center;
    }
    .email-content h1 {
      font-size: 24px;
      color: #ff66b2;
      margin-bottom: 10px;
    }
    .email-content p {
      font-size: 16px;
      line-height: 1.6;
      color: #555555;
      margin: 0 0 20px;
    }
    .otp-box {
      display: inline-block;
      background-color: #ff66b2;
      color: #ffffff;
      padding: 20px 30px;
      border-radius: 8px;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 2px;
      margin: 20px 0;
    }
    .email-footer {
      text-align: center;
      padding: 20px;
      border-top: 1px solid #f8d9e3;
      font-size: 14px;
      color: #777777;
    }
    .email-footer p {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <img src="https://via.placeholder.com/200x50?text=Sarradise" alt="Sarradise Logo">
    </div>
    <div class="email-content">
      <h1>Password Recovery</h1>
      <p>We received a request to reset your password. Please use the following OTP to complete the process. This OTP will be valid for 5 minutes.</p>
      <div class="otp-box">${OTP}</div>
    </div>
    <div class="email-footer">
      <p>Best Regards,<br>Sarradise</p>
      <p>7070 Habib Bourguiba Street, Home 100<br>Ras Jebal, Bizerte</p>
    </div>
  </div>
</body>
</html>
`;
  
      await sendEmail({
        recipient_email,
        subject: "Password Recovery",
        html: htmlContent
      });
  
      res.status(200).send({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending recovery email:", error);
      res.status(500).send({ error: "Internal Server Error: " + error.message });
    }
  });
  

module.exports = router