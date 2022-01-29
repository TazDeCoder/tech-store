const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const brandController = require("../controllers/brandController");
const categoryController = require("../controllers/categoryController");

/// ITEM ROUTES ///

// GET browse home page
router.get("/", itemController.itemIndex);
// GET request for creating an Item
router.get("/item/create", itemController.itemCreateGet);
// POST request for creating an Item
router.post("/item/create", itemController.itemCreatePost);
// GET request to delete Item
router.get("/item/:id/delete", itemController.itemDeleteGet);
// POST request to delete Item
router.post("/item/:id/delete", itemController.itemDeletePost);
// GET request to update Item
router.get("/item/:id/update", itemController.itemUpdateGet);
// POST request to update Item
router.post("/item/:id/update", itemController.itemUpdatePost);
// GET request for one Item
router.get("/item/:id", itemController.itemDetail);
// GET request for list of all Items.
router.get("/items", itemController.itemList);

/// BRAND ROUTES ///

// GET request for creating a Brand
router.get("/brand/create", brandController.brandCreateGet);
// POST request for creating a Brand
router.post("/brand/create", brandController.brandCreatePost);
// GET request to delete Brand
router.get("/brand/:id/delete", brandController.brandDeleteGet);
// POST request to delete Brand
router.post("/brand/:id/delete", brandController.brandDeletePost);
// GET request to update Brand
router.get("/brand/:id/update", brandController.brandUpdateGet);
// POST request to update Brand
router.post("/brand/:id/update", brandController.brandUpdatePost);
// GET request for one Brand
router.get("/brand/:id", brandController.brandDetail);
// GET request for list of all Brands
router.get("/brands", brandController.brandList);

/// CATEGORY ROUTES ///

// GET request for creating a Category
router.get("/category/create", categoryController.categoryCreateGet);
// POST request for creating a Category
router.post("/category/create", categoryController.categoryCreatePost);
// GET request to delete Category
router.get("/category/:id/delete", categoryController.categoryDeleteGet);
// POST request to delete Category
router.post("/category/:id/delete", categoryController.categoryDeletePost);
// GET request to update Category
router.get("/category/:id/update", categoryController.categoryUpdateGet);
// POST request to update Category
router.post("/category/:id/update", categoryController.categoryUpdatePost);
// GET request for one Category
router.get("/category/:id", categoryController.categoryDetail);
// GET request for list of all Categories
router.get("/categories", categoryController.categoryList);

module.exports = router;
