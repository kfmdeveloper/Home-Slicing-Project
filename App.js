const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listenings = require("./models/listing");
const { log } = require("console");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
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

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(500, error);
  } else {
    next();
  }
};

// home route
app.get("/", (req, res) => res.send("Hello World!"));

// All listing
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listenings.find({});
    res.render("listings/Listings.ejs", { allListings });
  })
);
//new listings
app.get("/listings/new", (req, res) => {
  let data = req.body;
  res.render("listings/CreateListing.ejs");
});
// New listings
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const { title, description, price, location, country, image } = req.body;
    const newListing = await Listenings.create({
      title,
      description,
      price,
      location,
      country,
      image,
    });
    console.log("New Listing added:", newListing);
    res.redirect("/listings");
  })
);

// Show listenings
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Listenings.findById(id);
    res.render("listings/show.ejs", { data });
  })
);

// Delete listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listenings.findByIdAndDelete(id);
    console.log("Deleted Successfully");
    res.redirect("/listings");
  })
);
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let editedData = await Listenings.findById(id);
  res.render("listings/edit.ejs", { editedData });
});
// Edit listing
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country, image } = req.body;
    const updatedListing = await Listenings.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        location,
        country,
        image,
      },
      { new: true }
    );
    res.redirect("/listings");
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some thing Went Wrong!" } = err;
  // res.status(statusCode).send(message);
  res.render("error.ejs", { statusCode, message });
});

// Rest of your code...

const port = 8080;
app.listen(port, () =>
  console.log(` app listening on port http://localhost:${port}`)
);
