const async = require("async");
const { body, validationResult } = require("express-validator");

const Category = require("../models/category");
const Item = require("../models/item");

const categoryList = function (req, res, next) {
  Category.find().exec(function (err, listCategories) {
    if (err) return next(err);
    res.render("categoryList", {
      title: "Category List",
      categoryList: listCategories,
    });
  });
};

const categoryDetail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      categoryItems: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (!results?.category) {
        var err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("categoryDetail", {
        title: results.category.name,
        categoryItems: results.categoryItems,
      });
    }
  );
};

const categoryCreateGet = function (req, res) {
  res.render("categoryForm", { title: "Create Category" });
};

const categoryCreatePost = [
  // Validate and sanitise fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create category object
    const category = new Category({
      name: req.body.name,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      // Data provided is valid
      // Check if Category with same name already exists
      Category.findOne({ name: req.body.name }).exec(function (err, foundCatg) {
        if (err) return next(err);
        if (foundCatg)
          // Category exists so redirect to its detail page
          res.redirect(foundCatg.url);
        else {
          // Category doesn't exist. Save category to database
          category.save(function (err) {
            if (err) return next(err);
            res.redirect(category.url);
          });
        }
      });
    }
  },
];

const categoryDeleteGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const categoryDeletePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const categoryUpdateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const categoryUpdatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

module.exports = {
  categoryList,
  categoryDetail,
  categoryCreateGet,
  categoryCreatePost,
  categoryDeleteGet,
  categoryDeletePost,
  categoryUpdateGet,
  categoryUpdatePost,
};
