const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db/cars.db");

const getAllCars = (callback) => {
  const sql = "SELECT * FROM cars";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, rows);
  });
};

const addCar = (carData, callback) => {
  const { id, make, model, package: carPackage, color, year, category, mileage, price } =
    carData;

  if (!id || !make || !model || !year || !category || !price) {
    return callback(
      {
        message: "All fields except color, package, and mileage are required.",
      },
      null
    );
  }

  const sql =
    "INSERT INTO cars (id, make, model, package, color, year, category, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const params = [
    id,
    make,
    model,
    carPackage,
    color,
    year,
    category,
    mileage,
    price,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return callback(
          {
            message:
              "Duplicate license plate. Please use a unique license plate.",
          },
          null
        );
      }
      return callback(err, null);
    }
    callback(null, { id });
  });
};

const getCarById = (id, callback) => {
  db.get("SELECT * FROM cars WHERE id = ?", [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

module.exports = {
  addCar,
  getAllCars,
  getCarById
};
