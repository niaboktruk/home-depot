const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");

router.get("/", carController.getAllCars);
router.post("/", carController.addCar);
router.get("/:id", carController.getCarById);
router.delete("/:id", carController.deleteCarById);

module.exports = router;
