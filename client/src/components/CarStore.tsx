import React, { useEffect } from "react";
import {
  Alert,
  CircularProgress,
  Backdrop,
  Fab,
  Snackbar,
  AlertColor,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { deleteCar, fetchCars } from "../service/cars";
import { Car } from "../models/car";
import CarList from "./CarList";
import ModalAddCar from "./ModalAddCar";

const CarStore: React.FC = () => {
  const [cars, setCars] = React.useState<Car[]>([]);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [severity, setSeverity] = React.useState<AlertColor>();
  const [snackMessage, setSnackMessage] = React.useState("");
  const [openModalNewCar, setOpenModalNewCar] = React.useState(false);

  useEffect(() => {
    const getCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
        setLoading(false);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    getCars();
  }, []);

  const handleError = (err: unknown) => {
    if (err instanceof Error) setSnackMessage(err.message);
    else setSnackMessage("An unknown error occurred.");
    setSeverity("error");
    setOpenSnack(true);
    setLoading(false);
  };

  const addSavedCar = (savedCar: Car) => {
    setCars((prevCars) => [...prevCars, savedCar]);
    setSeverity("success");
    setSnackMessage("Car added with success");
    setOpenSnack(true);
  };

  const handleDeleteCar = async (carId: string) => {
    try {
      setLoading(true);
      await deleteCar(carId);
      const updatedCars = cars.filter((car) => car.id !== carId);
      setCars(updatedCars);
      setLoading(false);
      setSeverity("success");
      setSnackMessage("Car removed with success");
      setOpenSnack(true);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const handleOpenAddCarModal = () => {
    setOpenModalNewCar(true);
  };

  const handleCloseAddCarModal = () => {
    setOpenModalNewCar(false);
  };

  const handleCloseSnack = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          severity={severity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        sx={{
          position: "absolute",
          bottom: 50,
          right: 50,
        }}
        aria-label="add"
        onClick={handleOpenAddCarModal}
      >
        <AddIcon />
      </Fab>

      <ModalAddCar
        open={!!openModalNewCar}
        onClose={handleCloseAddCarModal}
        newCar={addSavedCar}
      ></ModalAddCar>

      <div style={{ textAlign: "center" }}>
        <h1>Home Depot</h1>
        <h2>Car Store</h2>
      </div>

      <CarList cars={cars} onDelete={handleDeleteCar}></CarList>
    </>
  );
};

export default CarStore;
