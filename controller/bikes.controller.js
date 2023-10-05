const HttpStatus = require("http-status");
const BikesModel = require("../models/bikes.model");
const { to, ReS, ReE } = require("../services/util.services");

const getBikes = async (req, res) => {
  let err, bikes;

  [err, bikes] = await to(BikesModel.find({ active: true }));

  if (err) {
    console.log("Error while fetching bikes...", err);
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  } else
    return ReS(
      res,
      { message: "Bikes list are", bikes: bikes, success: true },
      HttpStatus.OK
    );
};

module.exports.getBikes = getBikes;
