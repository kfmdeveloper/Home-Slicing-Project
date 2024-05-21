const mongoose = require("mongoose");

const listingScehma = mongoose.Schema({
  title: {
    type: String,
    set: (v) => (v === "" ? "Khalid's House" : v),
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? " https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listenings = mongoose.model("Listenings", listingScehma);
module.exports = Listenings;
