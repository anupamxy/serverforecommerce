import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  ProductPhotoController,
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  realtedProductController,
  searchProductController,
  updateProductController,
} from "../controller/ProductController.js";
import formidable from "express-formidable";

const router = express.Router();

//router
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,

  createProductController
);

router.get("/get-product", getProductController);
router.get("/get-product/:slug", getSingleProductController);
router.get("/product-photo/:productId", ProductPhotoController);
router.delete("/delete-product/:productId", deleteProductController);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  updateProductController
);
//filter all products
router.post("/product-filters", productFiltersController);
//product count
router.get("/product-count", productCountController);
//product per page
router.get("/product-list/:page", productListController);
//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);
//payment route
router.get('/braintree/token',braintreeTokenController);
//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
export default router;
