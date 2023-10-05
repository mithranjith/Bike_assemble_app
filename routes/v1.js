const express = require("express");
const UserController = require("../controller/user.controller");
const BikesController = require("../controller/bikes.controller");
const AssembledDataController = require("../controller/assembles.controller");
const router = express.Router();
const passport = require("passport");

const { jwtAuth } = require("../middleware/passport");

const authUser = jwtAuth(passport).authenticate("jwt", { session: false });

router.get("/", (req, res) => {
  return res.json({ message: "Nothing here in this route" });
});

//************** User related Api's ******************//

router.post("/user", UserController.createUser); // Api to register user
router.get("/user", authUser, UserController.getUser); // Api to get user by token
router.post("/login", UserController.login); // Api to login user
router.post("/users", authUser, UserController.getAllUsers); // Api to get all users
router.get("/user", authUser, UserController.getUser); // Api to get a specific user details with token
router.get("/user/:id", authUser, UserController.getUserById); // Api to get a specific user details
router.put("/user/:id", authUser, UserController.updateUser); // Api to update a specific user
router.delete("/user/:id", authUser, UserController.deleteUser); // Api to delete a specific user

// **************** Bikes related Api's *************** //

router.get("/bikes", BikesController.getBikes); // Api to get bikes list

// **************** Assembled data related Api's ************** //
router.post(
  "/assembledData/report",
  authUser,
  AssembledDataController.GetAssembledDataReports
); // Api to get the assembled data reports

// *************** Admin Api's **************** //

router.post("/admin/login", UserController.adminLogin); // Api to login as an admin

module.exports = router;
