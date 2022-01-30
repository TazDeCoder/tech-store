const async = require("async");

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
