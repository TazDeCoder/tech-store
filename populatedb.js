#! /usr/bin/env node

console.log(
  "This script populates some test items, brands, and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Item = require("./models/item");
const Brand = require("./models/brand");
const Category = require("./models/category");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let brands = [];
let categories = [];
let items = [];

function brandCreate(name, desc, cb) {
  const brandDetail = {
    name: name,
    description: desc,
  };

  const brand = new Brand(brandDetail);

  brand.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Brand: " + brand);
    brands.push(brand);
    cb(null, brand);
  });
}

function categoryCreate(name, cb) {
  const categoryDetail = {
    name: name,
  };

  const category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, desc, rDate, numStock, brand, catg, cb) {
  const itemDetail = {
    name: name,
    description: desc,
    released_date: rDate,
    number_in_stock: numStock,
    brand: brand,
    category: catg,
  };

  const item = new Item(itemDetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategoryBrands(cb) {
  async.series(
    [
      function (callback) {
        brandCreate(
          "Samsung",
          "The Samsung Group is a South Korean multinational manufacturing conglomerate headquartered in Samsung Town, Seoul, South Korea. It comprises numerous affiliated businesses, most of them united under the Samsung brand, and is the largest South Korean chaebol (business conglomerate). As of 2020, Samsung has the 8th highest global brand value",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Apple",
          "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services. Apple is the largest information technology company by revenue (totaling US$365.8 billion in 2021) and, as of January 2021, it is the world's most valuable company, the fourth-largest personal computer vendor by unit sales and second-largest mobile phone manufacturer. It is one of the Big Five American information technology companies, alongside Amazon, Alphabet Inc. (Google), Meta Platforms (Facebook), and Microsoft.",
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Nvidia",
          'Nvidia Corporation is an American multinational technology company incorporated in Delaware and based in Santa Clara, California. It designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market. Its primary GPU line, labeled "GeForce", is in direct competition with the GPUs of the "Radeon" brand by Advanced Micro Devices (AMD). Nvidia expanded its presence in the gaming industry with its handheld game consoles Shield Portable, Shield Tablet, and Shield Android TV and its cloud gaming service GeForce Now. Its professional line of GPUs are used in workstations for applications in such fields as architecture, engineering and construction, media and entertainment, automotive, scientific research, and manufacturing design',
          callback
        );
      },
      function (callback) {
        brandCreate(
          "Nintendo",
          "Nintendo Co. is a Japanese multinational video game company headquartered in Kyoto, Japan. It develops video games and video game consoles. Nintendo was founded in 1889 as Nintendo Karuta by craftsman Fusajiro Yamauchi and originally produced handmade hanafuda playing cards. After venturing into various lines of business during the 1960s and acquiring a legal status as a public company, Nintendo distributed its first console, the Color TV-Game, in 1977. It gained international recognition with the release of Donkey Kong in 1981 and the Nintendo Entertainment System and Super Mario Bros. in 1985",
          callback
        );
      },
      function (callback) {
        categoryCreate("Smartphones", callback);
      },
      function (callback) {
        categoryCreate("Computer Components", callback);
      },
      function (callback) {
        categoryCreate("Video Game Consoles", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createBooks(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Samsung Galaxy S21 FE 5G (128GB) - Graphite",
          "Part of Samsung's 21 Series that features a dynamic AMOLED 2X display, full HD+ resolution and a punch hole selfie camera",
          "2022-1-11",
          "15",
          brands[0],
          [categories[0]],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "iPhone 13 5G (128GB) - Starlight",
          "Fifteenth generation of iPhones that features a colourful, sharp and bright 6.1-inch Super Retina XDR display and durable flat-edge design with Ceramic Shield. A15 Bionic chip. A big leap in battery life to its predecessor",
          "2021-9-24",
          "19",
          brands[1],
          [categories[0]],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "GeForce RTX 3090",
          "Part of the RTX Series. Powered by Ampere—NVIDIA’s 2nd gen RTX architecture—doubling down on ray tracing and AI performance with enhanced Ray Tracing (RT) Cores, Tensor Cores, and new streaming multiprocessors. Plus, it features a staggering 24 GB of G6X memory, all to deliver the ultimate gaming experience",
          "2020-9-24",
          "1",
          brands[2],
          [categories[1]],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Nintendo DSi (4GB) - Matte Red",
          "Nintendo's third instalment of the Nintendo DS family introducing distinctive new features to handheld games: two LCD screens working in tandem (the bottom one being a touchscreen), a built-in microphone and support for wireless connectivity",
          "2008-11-1",
          "5",
          brands[3],
          [categories[2]],
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createCategoryBrands, createBooks],
  // Optional callback
  function (err, results) {
    if (err) console.log("FINAL ERR: " + err);
    else {
      console.log("Results: " + results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
