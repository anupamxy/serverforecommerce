import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv'
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.body;
    const { photo } = req.files;

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(500).send({ error: "All fields are required" });
    }

    if (!photo) {
      return res.status(500).send({ error: "Photo is required" });
    }

    if (photo.size > 10000000) {
      return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    const products = new productModel({ ...req.body, slug: slugify(name) });

    if (photo.data) {
      products.photo.data = photo.data;
      products.photo.contentType = photo.mimetype;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "AllProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

export const ProductPhotoController = async (req, res) => {
  try {
    const productId = req.params.productId.replace(/\n/g, ""); // Remove newline characters from the ID

    const product = await productModel.findById(productId).select("photo");

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    if (!product.photo || !product.photo.data) {
      return res.status(404).send({ error: "Photo not found" });
    }

    res.set("Content-Type", product.photo.contentType);
    res.send(product.photo.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving product photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.productId).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};
//update controller

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.body;
    const { photo } = req.files; // Retrieve the photo from req.files

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(500).send({ error: "All fields are required" });
    }

    if (!photo) {
      return res.status(500).send({ error: "Photo is required" });
    }

    if (photo.size > 10000000) {
      return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    const productId = req.params.pid.replace(/\n/g, ""); // Remove newline characters from the ID

    const product = await productModel.findByIdAndUpdate(
      productId,
      { ...req.body, slug: slugify(name) },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    if (photo.data) {
      product.photo.data = photo.data;
      product.photo.contentType = photo.mimetype;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};
//filter for product
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
//product list based upon page
// ...existing code...

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const regexKeyword = String(keyword);
    const result = await productModel.find({
      $or: [
        { name: { $regex: regexKeyword, $options: "i" } },
        { description: { $regex: regexKeyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(result);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in your Search",
      error: error.message,
    });
  }
};
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};


//payment gateway api

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};