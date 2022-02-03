// Third-party libraries
const async = require("async");
const { body, validationResult } = require("express-validator");
// Imported models
const Brand = require("../models/brand");
const Item = require("../models/item");

const brandList = function (req, res, next) {
  async.parallel(
    {
      brandCount: function (callback) {
        Brand.countDocuments({}, callback);
      },
      listBrands: function (callback) {
        Brand.find({}, "name").sort({ name: 1 }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render("brandView/list", {
        title: "All Brands",
        brandCount: results.brandCount,
        listBrands: results.listBrands,
      });
    }
  );
};

const brandDetail = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brandItems: function (callback) {
        Item.find({ brand: req.params.id }, "name description").exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (!results?.brand) {
        const err = new Error("Brand not found, or dosen't exist");
        err.status = 404;
        return next(err);
      }
      res.render("brandView/detail", {
        title: results.brand.name,
        brand: results.brand,
        brandItems: results.brandItems,
      });
    }
  );
};

const brandCreateGet = function (req, res) {
  res.render("brandView/form", { title: "Create Brand" });
};

const brandCreatePost = [
  // Validate and sanitise fields
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create brand object
    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      res.render("brandView/form", {
        title: "Create Brand",
        brand: brand,
      });
      return;
    } else {
      // Data provided is valid
      // Check if Brand with same name already exists
      Brand.findOne({ name: req.body.name }).exec(function (err, foundBrand) {
        if (err) return next(err);
        if (foundBrand)
          // Brand exists so redirect to its detail page
          res.redirect(foundBrand.url);
        else {
          // Brand doesn't exist. Save brand to database
          brand.save(function (err) {
            if (err) return next(err);
            res.redirect(brand.url);
          });
        }
      });
    }
  },
];

const brandDeleteGet = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brandItems: function (callback) {
        Item.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (!results?.brand) res.redirect("/browse/brands");
      res.render("brandView/delete", {
        title: `Delete Brand: ${results.brand.name}`,
        brand: results.brand,
        brandItems: results.brandItems,
      });
    }
  );
};

const brandDeletePost = function (req, res, next) {
  async.parallel(
    {
      brand: function (callback) {
        Brand.findById(req.params.id).exec(callback);
      },
      brandItems: function (callback) {
        Item.find({ brand: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.brandItems.length > 0) {
        // Brand has items. Render in same way as for GET route
        res.render("brandView/delete", {
          title: `Delete Brand: ${results.brand.name}`,
          brand: results.brand,
          brandItems: results.brandItems,
        });
        return;
      } else {
        // Brand has no items. Delete object and redirect to the list of brands
        Brand.findByIdAndRemove(req.body.brandid, function deleteBrand(err) {
          if (err) return next(err);
          res.redirect("/browse/brands");
        });
      }
    }
  );
};

const brandUpdateGet = function (req, res, next) {
  Brand.findById(req.params.id).exec(function (err, brand) {
    if (err) return next(err);
    res.render("brandView/form", {
      title: `Update Brand: ${brand.name}`,
      brand: brand,
    });
  });
};

const brandUpdatePost = [
  // Validate and sanitise fields
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    // Create brand object
    const brand = new Brand({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
    });
    // Check for any validation errors
    if (!errors.isEmpty()) {
      res.render("brandView/form", {
        title: `Update Brand: ${brand.name}`,
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data provided is valid. Update brand
      Brand.findByIdAndUpdate(req.params.id, brand, {}, function (err, brand) {
        if (err) return next(err);
        res.redirect(brand.url);
      });
    }
  },
];

module.exports = {
  brandList,
  brandDetail,
  brandCreateGet,
  brandCreatePost,
  brandDeleteGet,
  brandDeletePost,
  brandUpdateGet,
  brandUpdatePost,
};
