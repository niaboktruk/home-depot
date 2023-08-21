import React, { useEffect } from "react";
import { Alert, CircularProgress, Backdrop, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { fetchCars } from "../service/cars";
import { Car } from "../models/car";
import CarList from "./CarList";
import ModalAddCar from "./ModalAddCar";

const CarStore: React.FC = () => {
  const [cars, setCars] = React.useState<Car[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openModalNewCar, setOpenModalNewCar] = React.useState(false);
  const [error, setError] = React.useState<{ message: string } | null>(null);

  useEffect(() => {
    const getCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setError({ message: err.message });
        else setError({ message: "An unknown error occurred." });
        setLoading(false);
      }
    };

    getCars();
  }, []);

  const addSavedCar = (savedCar: Car) => {
    setCars((prevCars) => [...prevCars, savedCar]);
  };

  const handleOpenAddCarModal = () => {
    setOpenModalNewCar(true);
  };

  const handleCloseAddCarModal = () => {
    setOpenModalNewCar(false);
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

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Home Depot</h1>
        <h2>Car Store</h2>
      </div>

      <CarList cars={cars}></CarList>

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
    </>
  );
};

export default CarStore;
