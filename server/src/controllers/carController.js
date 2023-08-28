const carService = require("../services/carService");
const logger = require("../../logger");

exports.getAllCars = (req, res) => {
  const { method, url, query, body } = req;
  carService.getAllCars((err, cars) => {
    if (err) {
      logger.error(
        `getAllCars - ${
          err.message
        } - ${method} ${url} - Query: ${JSON.stringify(
          query
        )} - Body: ${JSON.stringify(body)}`
      );
      return res.status(500).json({ error: err.message });
    }
    logger.info(
      `getAllCars - ${method} ${url} - Query: ${JSON.stringify(
        query
      )} - Body: ${JSON.stringify(body)}`
    );
    res.json({
      message: "success",
      data: cars,
    });
  });
};

exports.addCar = (req, res) => {
  const { method, url, query, body } = req;
  carService.addCar(req.body, (err) => {
    if (err) {
      if (err.message) {
        logger.error(
          `addCar - ${err.message} - ${method} ${url} - Query: ${JSON.stringify(
            query
          )} - Body: ${JSON.stringify(body)}`
        );
        return res.status(409).json({ error: err.message });
      }
      logger.error(
        `addCar - Failed to add the car - ${method} ${url} - Query: ${JSON.stringify(
          query
        )} - Body: ${JSON.stringify(body)}`
      );
      return res.status(400).json({ error: "Failed to add the car." });
    }

    res.status(201).json({
      message: "success",
      data: req.body,
    });
  });
};

exports.getCarById = (req, res) => {
  const { method, url, query, body } = req;
  carService.getCarById(req.params.id, (error, car) => {
    if (error) {
      logger.error(
        `getCarById - ${
          err.message
        } - ${method} ${url} - Query: ${JSON.stringify(
          query
        )} - Body: ${JSON.stringify(body)}`
      );
      res.status(500).json({ message: error.message });
    } else if (car) {
      logger.info(
        `getCarById - ${method} ${url} - Query: ${JSON.stringify(
          query
        )} - Body: ${JSON.stringify(body)}`
      );
      res.json(car);
    } else {
      logger.error(
        `getCarById - Car not found - ${method} ${url} - Query: ${JSON.stringify(
          query
        )} - Body: ${JSON.stringify(body)}`
      );
      res.status(404).json({ message: "Car not found" });
    }
  });
};

exports.deleteCarById = (req, res) => {
  const { method, url, query, body } = req;

  carService.checkCarExistsById(req.params.id, (error, carExists) => {
    if (error) {
      logger.error(
        `deleteCarById - Error while checking car existence - ${error.message}`
      );
      return res.status(500).json({ error: "Failed to delete the car." });
    }

    if (!carExists) {
      logger.error(`deleteCarById - Car not found - ${method} ${url}`);
      return res.status(404).json({ error: "Car not found." });
    }

    carService.deleteCarById(req.params.id, (deleteError, deleteResult) => {
      if (deleteError) {
        logger.error(
          `deleteCarById - ${
            deleteError.message
          } - ${method} ${url} - Query: ${JSON.stringify(
            query
          )} - Body: ${JSON.stringify(body)}`
        );
        return res.status(500).json({ error: "Failed to delete the car." });
      }

      logger.info(
        `deleteCarById - Car deleted successfully - ${method} ${url}`
      );
      res.status(204).end(); // 204 No Content
    });
  });
};
