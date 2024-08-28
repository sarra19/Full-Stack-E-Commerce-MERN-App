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


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

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
        // Validate request body
        const { OTP, recipient_email } = req.body;
        if (!OTP || !recipient_email) {
            return res.status(400).send({ error: "OTP and recipient_email are required" });
        }

        // Call sendEmail function
        const response = await sendEmail(req.body);

        // Send success response
        res.status(200).send({ message: response.message });
    } catch (error) {
        // Send error response
        console.error("Error sending recovery email:", error); // Log error for debugging
        res.status(500).send({ error: "Internal Server Error: " + error.message });
    }
});

module.exports = router