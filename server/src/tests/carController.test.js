const request = require("supertest");
const app = require("../../server");
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db/cars.db");

describe("Car API routes /cars", () => {
  const newCar = {
    id: "XYZ1234",
    make: "Honda",
    model: "Civic",
    year: 2020,
    price: 25000,
    category: "Sedan",
  };

  // afterAll(async () => {
  //   await db.run(`DELETE FROM cars WHERE id = ?`, newCar.id);
  // });

  it("should fetch all cars", async () => {
    const res = await request(app).get("/cars");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should add a new car", async () => {
    const res = await request(app).post("/cars").send(newCar);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty("id");
  });

  it("should deny to save an existent car", async () => {
    const res = await request(app).post("/cars").send(newCar);

    expect(res.statusCode).toEqual(409);
  });

  it("Should delete an existent car", async () => {
    const res = await request(app).delete(`/cars/${newCar.id}`);
    expect(res.statusCode).toBe(204);
  });
});
