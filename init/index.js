const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const Listenings = require("../models/listing");
const MONOG_URL = "mongodb://127.0.0.1:27017/MajorProject";
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONOG_URL);
}

const myData = async () => {
  await Listenings.deleteMany({});
  await Listenings.insertMany(initData.data);
  console.log("Data has been initialized!");
};
myData();
