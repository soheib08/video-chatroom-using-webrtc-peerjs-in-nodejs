let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roomsSchema = new Schema({
  url: { type: String, required: true },
  userCount: { type: Number, default: 0 },
});

//Export model
module.exports = mongoose.model("Rooms", roomsSchema);
