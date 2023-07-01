import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";



const router = express.Router();

// REGISTER || METHOD POST
router.post("/register", registerController);
//LOGIN
router.post("/login", loginController);
//FORGOT PASSWORD
router.post("/forgot-password", forgotPasswordController);
router.get("/test", requireSignIn, isAdmin, testController);
//protected routes for user 
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected routes for Admin
router.get("/admin-auth", requireSignIn,isAdmin,(req, res) => {
  res.status(200).send({ ok: true });
});
//update profile
router.put("/profile", requireSignIn, updateProfileController);
//order
router.get("/orders", requireSignIn, getOrdersController);
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);



export default router;
