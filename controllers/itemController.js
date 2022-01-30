const Item = require("../models/item");

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

const itemCreateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const itemCreatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const itemDeleteGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const itemDeletePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const itemUpdateGet = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

const itemUpdatePost = function (req, res) {
  res.send("NOT IMPLEMENTED YET");
};

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
