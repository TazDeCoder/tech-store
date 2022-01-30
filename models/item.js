const intlFormat = require("date-fns/intlFormat");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  released_date: {
    type: Date,
    required: true,
  },
  number_in_stock: {
    type: Number,
    required: true,
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

ItemSchema.virtual("url").get(function () {
  return `/browse/item/${this._id}`;
});

ItemSchema.virtual("released_date_formatted").get(function () {
  return intlFormat(this.released_date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

module.exports = mongoose.model("Item", ItemSchema);
