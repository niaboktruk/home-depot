import React, { useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Modal,
  Box,
  Alert,
  CircularProgress,
  Backdrop,
  Fab,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createCar, fetchCars } from "../service/cars";
import { Car } from "../models/car";

const styleDetails = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 6,
  display: "flex",
  flexDirection: "column",
};

const styleAddCar = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "70vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 6,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

type CustomError = {
  message: string;
};

interface CarFormErrors {
  id?: string;
  make?: string;
  model?: string;
  year?: string;
  price?: string;
  category?: string;
}

const CarList: React.FC = () => {
  const [cars, setCars] = React.useState<Car[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<CustomError | null>(null);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openAddCar, setOpenAddCar] = React.useState(false);
  const [selectedCar, setSelectedCar] = React.useState<Car>();
  const [formData, setFormData] = React.useState({
    id: "",
    make: "",
    model: "",
    year: "",
    price: "",
    package: "",
    color: "",
    mileage: "",
    category: "",
  });
  const [formErrors, setFormErrors] = React.useState<CarFormErrors>({});
  const [formSubmitError, setformSubmitError] = React.useState<CustomError | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: CarFormErrors = {};
    if (!formData.id || formData.id.length < 7)
      newErrors.id = "License Plate is required and it must have 7 characters.";
    if (!formData.make) newErrors.make = "Make is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.price) newErrors.price = "Price is required.";

    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const formattedData: Car = {
          ...formData,
          year: parseInt(formData.year),
          price: parseInt(formData.price),
          mileage: formData.mileage ? parseFloat(formData.mileage) : 0,
        };
        const savedCar = await createCar(formattedData);
        setCars((prevCars) => [...prevCars, savedCar]);
        setOpenAddCar(false);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setformSubmitError({ message: err.message });
        else setformSubmitError({ message: "An unknown error occurred." });
        setOpenAddCar(false);
        setLoading(false);
      }
    }
  };

  const handleOpen = (car: Car) => {
    setSelectedCar(car);
    setOpenDetails(true);
  };
  const handleClose = () => setOpenDetails(false);

  const handleOpenAddCar = () => {
    setFormData({
      id: "",
      make: "",
      model: "",
      year: "",
      price: "",
      package: "",
      color: "",
      mileage: "",
      category: "",
    });
    setFormErrors({
      id: "",
      make: "",
      model: "",
      year: "",
      price: "",
      category: "",
    });
    setformSubmitError(null);
    setOpenAddCar(true);
  };
  const handleCloseAddCar = () => setOpenAddCar(false);

  const formatPrice = (priceInCents: number | undefined) => {
    if (!priceInCents) {
      return "-";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(priceInCents / 100);
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
      <Fab
        color="primary"
        sx={{
          position: "absolute",
          bottom: 50,
          right: 50,
        }}
        aria-label="add"
        onClick={handleOpenAddCar}
      >
        <AddIcon />
      </Fab>
      <div style={{ textAlign: "center" }}>
        <h1>Home Depot</h1>
        <h2>List of cars available</h2>
      </div>
      <div
        style={{
          margin: "0 10%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          padding: "2em",
        }}
      >
        <Grid container spacing={3} direction="row">
          {cars.map((car) => (
            <Grid
              item
              sx={{ minWidth: "300px" }}
              sm={6}
              md={4}
              lg={3}
              key={car.id}
              onClick={() => handleOpen(car)}
            >
              <Card>
                <CardHeader
                  title={`${car.make} ${car.model}`}
                  subheader={`Year: ${car.year}`}
                />
                <CardContent>
                  <Typography variant="body1" color="text.secondary">
                    Price {formatPrice(car.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>

      <Modal
        open={openDetails}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleDetails}>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            {selectedCar?.make} {selectedCar?.model} {selectedCar?.year}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            License Plate: {selectedCar?.id} <br />
            Package: {selectedCar?.package} <br />
            Color: {selectedCar?.color} <br />
            Category: {selectedCar?.category} <br />
            Mileage: {selectedCar?.mileage} <br />
            Price: {formatPrice(selectedCar?.price)}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openAddCar}
        onClose={handleCloseAddCar}
        aria-labelledby="add-car-modal-title"
        aria-describedby="add-car-modal-description"
      >
        <Box sx={styleAddCar}>
          <Typography
            id="add-car-modal-title"
            variant="h4"
            component="h2"
            gutterBottom
          >
            Insert a new car
          </Typography>
          {formSubmitError && (
            <Typography color="red" sx={{ mt: 2 }}>
                {formSubmitError.message}
            </Typography>
          )}
          <Box component="form" noValidate sx={{ mt: 2, width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="License Plate"
              variant="outlined"
              inputProps={{
                maxLength: 7,
                minLength: 7,
              }}
              error={Boolean(formErrors.id)}
              helperText={formErrors.id}
              value={formData.id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, id: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Make"
              variant="outlined"
              error={Boolean(formErrors.make)}
              helperText={formErrors.make}
              value={formData.make}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, make: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Model"
              variant="outlined"
              error={Boolean(formErrors.model)}
              helperText={formErrors.model}
              value={formData.model}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, model: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Package"
              variant="outlined"
              value={formData.package}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, package: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Color"
              variant="outlined"
              value={formData.color}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, color: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Year"
              type="number"
              variant="outlined"
              error={Boolean(formErrors.year)}
              helperText={formErrors.year}
              value={formData.year}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, year: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Category"
              variant="outlined"
              error={Boolean(formErrors.category)}
              helperText={formErrors.category}
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mileage"
              type="number"
              variant="outlined"
              value={formData.mileage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mileage: e.target.value }))
              }
            />
            <TextField
              fullWidth
              margin="normal"
              label="Price (in cents)"
              type="number"
              variant="outlined"
              error={Boolean(formErrors.price)}
              helperText={formErrors.price}
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
            />
            <Button
              sx={{ mt: 3, alignSelf: "center" }}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Add Car
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CarList;
