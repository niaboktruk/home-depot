import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Car } from "../models/car";
import { createCar } from "../service/cars";

interface AddCarModalProps {
  open: boolean;
  onClose: () => void;
  newCar: (newCar: Car) => void;
}

interface FormData {
  id: string;
  make: string;
  model: string;
  year: string;
  price: string;
  package?: string;
  color?: string;
  mileage?: string;
  category: string;
}

const initialFormData: FormData = {
  id: "",
  make: "",
  model: "",
  year: "",
  price: "",
  package: "",
  color: "",
  mileage: "",
  category: "",
};

const ModalAddCar: React.FC<AddCarModalProps> = ({ open, onClose, newCar }) => {
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] =
    React.useState<Partial<FormData>>(initialFormData);
  const [loading, setLoading] = React.useState(false);
  const [formSubmitError, setformSubmitError] = React.useState<{
    message: string;
  } | null>(null);

  useEffect(() => {
    if (open) 
      setFormData(initialFormData);
      setformSubmitError(null);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<FormData> = {};
    if (!formData.id || formData.id.length < 7)
      newErrors.id = "License Plate must have 7 characters.";
    if (!formData.make) newErrors.make = "Make is required.";
    if (!formData.model) newErrors.model = "Model is required.";
    if (
      !formData.year ||
      parseInt(formData.year) < 1910 ||
      parseInt(formData.year) > new Date().getFullYear() + 1
    )
      newErrors.year = "Please add a valid year.";
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
        newCar(savedCar);
        onClose();
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setformSubmitError({ message: err.message });
        else setformSubmitError({ message: "An unknown error occurred." });
        setLoading(false);
      }
    }
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
    <Modal
      open={open}
      aria-labelledby="add-car-modal-title"
      aria-describedby="add-car-modal-description"
    >
      <Box className="modal-container">
        <Typography
          id="add-car-modal-title"
          variant="h4"
          component="h2"
          gutterBottom
        >
          Insert a new car
        </Typography>

        <Box className="modal-content">
          {formSubmitError && (
            <Typography color="red" sx={{ mt: 2 }}>
              {formSubmitError.message}
            </Typography>
          )}
          <Box component="form" sx={{width: '90%' }}>
            <TextField
              fullWidth
              margin="normal"
              label="License Plate"
              variant="outlined"
              inputProps={{
                maxLength: 7
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
          </Box>
        </Box>
        <Box className="modal-footer">
          <Button
            sx={{ mt: 3, alignSelf: "center" }}
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Add Car
          </Button>
          <Button
            sx={{ mt: 3, ml: 2, alignSelf: "center" }}
            variant="contained"
            color="primary"
            type="submit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAddCar;
