const Category = require("../models/category");

const categoryList = function (req, res, next) {
  Category.find().exec(function (err, listCategories) {
    if (err) return next(err);
    res.render("categoryList", {
      title: "Category List",
      categoryList: listCategories,
    });
  });
};

const categoryDetail = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const categoryCreateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const categoryCreatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

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
