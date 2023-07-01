import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { 
    
  createCategoryController,
  deleteCategoryCOntroller,
  getControlller,
  singleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";

const router = express.Router();

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
  
);
router.get("/get-category",
getControlller
);

router.get("/single-category/:slug", singleCategoryController);
router.delete(
    "/delete-category/:id",
    requireSignIn,
    isAdmin,
    deleteCategoryCOntroller
  );

export default router;
