const UsersModel = require("../models/users.model");
const BikesModel = require("../models/bikes.model");
const AssemblesModel = require("../models/assembles.model");
const { to, isNull, ReE, ReS } = require("../services/util.services");
const HttpStatus = require("http-status");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment");

const getAssembledDataById = async function (req, res) {
  /**
   * 
   * This API is used to get specified details of assembled data
     based on the id generated during registration
   *@ params - id - assembled data id   
   */

  const id = req.params.id;

  let query = {
    active: true,
    _id: new ObjectId(id),
  };

  let err, assembledData;
  [err, assembledData] = await to(AssemblesModel.findOne(query));

  if (err) {
    return ReE(res, err, HttpStatus.BAD_REQUEST);
  } else {
    if (isNull(assembledData)) {
      return ReE(
        res,
        {
          data: "No assembled data found",
        },
        HttpStatus.NOT_FOUND
      );
    } else {
      return ReS(
        res,
        {
          data: assembledData,
        },
        HttpStatus.OK
      );
    }
  }
};

module.exports.getAssembledDataById = getAssembledDataById;

const getAssembledDataByUser = async function (req, res) {
  /**
   * 
   * This API is used to get assembled data details of an user
     based on the id generated during registration
   *@ params - user - user id   
   */

  const id = req.params.user;

  let query = {
    active: true,
    _id: new ObjectId(id),
  };

  let err, user;
  [err, user] = await to(UsersModel.findOne(query));

  if (err) {
    return ReE(res, err, HttpStatus.BAD_REQUEST);
  } else {
    if (isNull(user)) {
      return ReE(
        res,
        {
          user: "No user found",
        },
        HttpStatus.NOT_FOUND
      );
    } else {
      let assembledData;

      query = {
        user: new ObjectId(id),
        active: true,
      }[(err, assembledData)] = await to(AssemblesModel.find(query));

      if (err) {
        console.log("Error while fetching  assembled data of a bike...", err);
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return ReS(
        res,
        {
          data: assembledData,
          success: true,
        },
        HttpStatus.OK
      );
    }
  }
};

module.exports.getAssembledDataByUser = getAssembledDataByUser;

const getAssembledDataByBike = async function (req, res) {
  /**
   * 
   * This API is used to get assembled data details of a bike
     based on the id generated during registration
   *@ params - bike - bike id   
   */

  const id = req.params.bike;

  let query = {
    active: true,
    _id: new ObjectId(id),
  };

  let err, bike;
  [err, bike] = await to(BikesModel.findOne(query));

  if (err) {
    return ReE(res, err, HttpStatus.BAD_REQUEST);
  } else {
    if (isNull(bike)) {
      return ReE(
        res,
        {
          bike: "No bike found",
        },
        HttpStatus.NOT_FOUND
      );
    } else {
      let assembledData;

      query = {
        bike: new ObjectId(id),
        active: true,
      }[(err, assembledData)] = await to(AssemblesModel.find(query));

      if (err) {
        console.log("Error while fetching  assembled data of a bike...", err);
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return ReS(
        res,
        {
          data: assembledData,
          success: true,
        },
        HttpStatus.OK
      );
    }
  }
};

module.exports.getAssembledDataByBike = getAssembledDataByBike;

const getAllAssembledData = async function (req, res) {
  /**
 * This API is used to get list of all registered 
   active user to be displayed in admin platform.
 */
  let query;
  let page = req.body.page || 1;
  let limit = req.body.limit || 10;

  query = {
    active: true,
  };

  let options = {
    page: page,
    limit: limit,
    lean: true,
    populate: ["user", "bike"],
  };

  let err, assembledData;
  [err, assembledData] = await to(AssemblesModel.paginate(query, options));

  if (err) {
    return ReE(res, err, HttpStatus.BAD_REQUEST);
  } else {
    return ReS(
      res,
      {
        data: assembledData,
      },
      HttpStatus.OK
    );
  }
};

module.exports.getAllAssembledData = getAllAssembledData;

const getAllAssembledDataWithoutPagination = async function (req, res) {
  /**
 * This API is used to get list of all registered 
   active user to be displayed in admin platform.
 
 */

  let query = {
    active: true,
  };

  let err, assembledData;
  [err, assembledData] = await to(
    AssemblesModel.find(query).sort({ createdAt: -1 })
  );

  if (err) {
    return ReE(res, err, HttpStatus.BAD_REQUEST);
  } else {
    return ReS(
      res,
      {
        data: assembledData,
      },
      HttpStatus.OK
    );
  }
};

module.exports.getAllAssembledDataWithoutPagination =
  getAllAssembledDataWithoutPagination;

const GetAssembledDataReports = async (req, res) => {
  let body = req.body;
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var year = dateObj.getUTCFullYear();
  var day = dateObj.getUTCDate();

  if (isNull(body.mode))
    return ReE(
      res,
      { message: "Provide a valid mode", success: false },
      HttpStatus.BAD_REQUEST
    );

  let err,
    reports,
    dataset = {
      labels: [],
      datasets: [{ label: [], data: [] }],
    };

  let query = [
    {
      $match: {
        active: true,
      },
    },
  ]; // Declaring query

  switch (
    body.mode // Adding group stage in query based on the mode given in body
  ) {
    case "month": {
      query.push({
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      });
      break;
    }

    case "year": {
      query.push({
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      });
      break;
    }

    case "day": {
      query.push({
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      });
      break;
    }

    case "custom": {
      if (isNull(body.startDate) || isNull(body.lastDate))
        return ReE(
          res,
          { message: "Please provide a valid dates", success: false },
          HttpStatus.BAD_REQUEST
        );
      query[0].$match = {
        createdAt: {
          $lte: moment(body.lastDate).endOf("day").toDate(),
          $gte: moment(body.startDate).startOf("day").toDate(),
        },
        active: true,
      };
      query.push({
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      });
      break;
    }

    default:
      break;
  }

  query = [
    ...query,

    {
      $project: {
        _id: 0,
        day: "$_id.day",
        month: "$_id.month",
        year: "$_id.year",
        count: 1,
      },
    },
  ];

  [err, reports] = await to(AssemblesModel.aggregate(query));

  if (err) {
    return res.json(err);
  }
  if (reports !== null) {
    switch (body.mode) {
      case "month": {
        for (x in reports) {
          if (reports[x].year === year) {
            dataset.labels.push(reports[x].month);
            dataset["datasets"][0].data.push(reports[x].count);
          }
        }
        break;
      }
      case "day": {
        for (x in reports) {
          if (reports[x].month === month && reports[x].year === year) {
            dataset.labels.push(reports[x].day);
            dataset["datasets"][0].data.push(reports[x].count);
          }
        }
        break;
      }
      case "year": {
        for (x in reports) {
          dataset.labels.push(reports[x].year);
          dataset["datasets"][0].data.push(reports[x].count);
        }
        break;
      }

      case "custom": {
        for (x in reports) {
          if (
            dataset.labels.includes(
              `${reports[x].day} - ${reports[x].month} - ${reports[x].year}`
            )
          ) {
            dataset["datasets"][0].data.push(reports[x].count);
          } else {
            dataset.labels.push(
              `${reports[x].day} - ${reports[x].month} - ${reports[x].year}`
            );
            dataset["datasets"][0].data.push(reports[x].count);
          }
        }
        break;
      }

      default:
        break;
    }

    return res.json({
      message: "Reports are",
      success: true,
      dataset: dataset,
      labelString: body.mode,
      reports,
    });
  }
};

module.exports.GetAssembledDataReports = GetAssembledDataReports;
