const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const AsseblesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bikes",
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

AsseblesSchema.plugin(mongoosePaginate);

let Assembles = (module.exports = mongoose.model("assembles", AsseblesSchema));
