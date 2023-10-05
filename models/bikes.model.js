const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const BikesSchema = new mongoose.Schema(
  {
    fullame: {
      type: String,
      default: "",
    },
    assebleTime: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
  { strict: false }
);

BikesSchema.plugin(mongoosePaginate);

let Bikes = (module.exports = mongoose.model("bikes", BikesSchema));
