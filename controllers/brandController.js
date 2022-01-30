const Brand = require("../models/brand");

const brandList = function (req, res, next) {
  Brand.find()
    .sort({ name: 1 })
    .exec(function (err, listBrands) {
      if (err) return next(err);
      res.render("brandList", { title: "Brand List", brandList: listBrands });
    });
};

const brandDetail = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
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
