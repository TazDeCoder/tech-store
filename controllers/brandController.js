const async = require("async");

const Brand = require("../models/brand");
const Item = require("../models/item");

const brandList = function (req, res, next) {
  Brand.find()
    .sort({ name: 1 })
    .exec(function (err, listBrands) {
      if (err) return next(err);
      res.render("brandList", { title: "Brand List", brandList: listBrands });
    });
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
        const err = new Error("Brand not found");
        err.status = 404;
        return next(err);
      }
      res.render("brandDetail", {
        title: results.brand.name,
        brand: results.brand,
        brandItems: results.brandItems,
      });
    }
  );
};

const brandCreateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const brandCreatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const brandDeleteGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const brandDeletePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const brandUpdateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const brandUpdatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

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
