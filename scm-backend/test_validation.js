const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb+srv://appuaadi9950_db_user:Laptop.2006@scm-cluster.ku00t96.mongodb.net/scm_masala?retryWrites=true&w=majority")
  .then(async () => {
    try {
      const product = new Product({
        name: "Test Chilli",
        description: "Test description",
        category: "Chilli Powders",
        variants: [{ weight: "100g", price: 50, mrp: 60 }]
      });
      await product.validate();
      console.log("Validation passed!");
    } catch (e) {
      console.log("Validation failed:", e.message);
    }
    process.exit(0);
  });
