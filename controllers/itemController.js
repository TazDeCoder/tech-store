const async = require("async");
const _ = require("lodash");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const Brand = require("../models/brand");
const Category = require("../models/category");

const itemIndex = function (req, res) {
  res.render("index", { title: "Homepage" });
};

const itemList = function (req, res, next) {
  Item.find({}, "name description brand")
    .sort({ name: 1 })
    .populate("brand")
    .exec(function (err, listItems) {
      if (err) return next(err);
      res.render("itemList", { title: "Item List", itemList: listItems });
    });
};

const itemDetail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("brand")
    .populate("category")
    .exec(function (err, item) {
      if (err) next(err);
      res.render("itemDetail", { title: item.name, item: item });
    });
};

const itemCreateGet = function (req, res, next) {
  async.parallel(
    {
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render("itemForm", {
        title: "Create Item",
        brands: results.brands,
        categories: results.categories,
      });
    }
  );
};

const itemCreatePost = [
  // Convert the category to an array
  (req, res, next) => {
    if (!_.isArray(req.body.category)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = [req.body.category];
    }
    next();
  },
  // Validate and sanitise fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("released_date", "Released Date must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create item object
    const item = new Item({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      released_date: req.body.released_date,
      category: req.body.category,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          // Mark our selected categories as checked
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = "true";
            }
          }
          res.render("itemForm", {
            title: "Create Item",
            brands: results.brands,
            categories: results.categories,
            item: item,
          });
        }
      );
      return;
    } else {
      // Data provided is valid. Save item to database
      item.save(function (err) {
        if (err) return next(err);
        res.redirect(item.url);
      });
    }
  },
];

const itemDeleteGet = function (req, res, next) {
  Item.findById(req.params.id).exec(function (err, item) {
    if (err) return next(err);
    if (!item) res.redirect("/browse/items");
    res.render("itemDelete", { title: item.name, item: item });
  });
};

const itemDeletePost = function (req, res, next) {
  // Delete object and redirect to the list of items
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) return next(err);
    res.redirect("/browse/items");
  });
};

const itemUpdateGet = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
      brands: function (callback) {
        Brand.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (!results?.item) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Mark our selected categories as checked
      for (let allCIter = 0; allCIter < results.categories.length; allCIter++) {
        for (
          let itemCIter = 0;
          itemCIter < results.item.category.length;
          itemCIter++
        ) {
          if (
            results.categories[allCIter]._id.toString() ===
            results.item.category[itemCIter]._id.toString()
          ) {
            results.categories[allCIter].checked = "true";
          }
        }
      }
      res.render("itemForm", {
        title: `Update Item: ${results.item.name}`,
        brands: results.brands,
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

const itemUpdatePost = [
  // Convert the category to an array
  (req, res, next) => {
    if (!_.isArray(req.body.category)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
      else req.body.category = [req.body.category];
    }
    next();
  },
  // Validate and sanitise fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("released_date", "Released Date must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create item object
    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      released_date: req.body.released_date,
      number_in_stock: req.body.stock,
      category: req.body.category,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      async.parallel(
        {
          brands: function (callback) {
            Brand.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);
          // Mark our selected categories as checked
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = "true";
            }
          }
          res.render("itemForm", {
            title: `Update Item: ${item.name}`,
            brands: results.brands,
            categories: results.categories,
            item: item,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data provided is valid. Save item to database
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, item) {
        if (err) return next(err);
        res.redirect(item.url);
      });
    }
  },
];

module.exports = {
  itemIndex,
  itemList,
  itemDetail,
  itemCreateGet,
  itemCreatePost,
  itemDeleteGet,
  itemDeletePost,
  itemUpdateGet,
  itemUpdatePost,
};
