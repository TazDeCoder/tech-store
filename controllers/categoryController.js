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
        category: results.category,
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

const categoryDeleteGet = function (req, res, next) {
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
      if (!results?.category) res.redirect("/browse/categories");
      res.render("categoryDelete", {
        title: `Delete Category: ${results.category.name}`,
        category: results.category,
        categoryItems: results.categoryItems,
      });
    }
  );
};

const categoryDeletePost = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.body.authorid).exec(callback);
      },
      categoryItems: function (callback) {
        Item.find({ category: req.body.authorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.categoryItems.length > 0) {
        // Category has items. Render in same way as for GET route
        res.render("categoryDelete", {
          title: "Delete Author",
          category: results.category,
          categoryItems: results.categoryItems,
        });
        return;
      } else {
        // Category has no items. Delete object and redirect to the list of categories
        Category.findByIdAndRemove(
          req.body.categoryid,
          function deleteCategory(err) {
            if (err) return next(err);
            res.redirect("/browse/categories");
          }
        );
      }
    }
  );
};

const categoryUpdateGet = function (req, res, next) {
  Category.findById(req.params.id).exec(function (err, category) {
    if (err) return next(err);
    res.render("categoryForm", {
      title: "Update category",
      category: category,
    });
  });
};

const categoryUpdatePost = [
  // Validate and sanitise fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create category object
    const category = new Category({
      _id: req.params.id,
      name: req.body.name,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      res.render("categoryForm", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      // Data provided is valid. Update category
      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, category) {
          if (err) return next(err);
          res.redirect(category.url);
        }
      );
    }
  },
];

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
