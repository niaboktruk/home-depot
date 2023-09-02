import { Box, Button, Modal, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import formatPrice from "../util/formatPrice";
import { Car } from "../models/car";
import { useEffect, useState } from "react";

interface ModalDetailCarProps {
  car: Car | null;
  open: boolean;
  onClose: () => void;
  onDelete: (carId: string) => void;
}

const ModalDetailCar: React.FC<ModalDetailCarProps> = ({
  car,
  open,
  onClose,
  onDelete,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfirmation(false);
    }
  }, [open]);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = (carId: string) => {
    onClose();
    onDelete(carId);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-container">
        {showConfirmation && (
          <Box className="confirmation-popup">
            <Typography variant="h4" component="h4">
              Remove car
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Are you sure you want to remove this car? <b>{car?.make} {car?.model} {car?.year}</b>
            </Typography>
            <Box className="confirmation-buttons" sx={{ mt: 2, float: "right"}}>
              <Button
                sx={{ mt: 3, alignSelf: "center" }}
                variant="contained"
                color="primary"
                onClick={() => handleConfirmDelete(car!.id)}
                startIcon={<DeleteIcon />}
              >
                Remove
              </Button>
              <Button
                sx={{ mt: 3, ml: 2, alignSelf: "center" }}
                variant="outlined"
                color="primary"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
        {!showConfirmation && (
          <Box>
            <Box className="modal-header">
              <Typography variant="h4" component="h2">
                {car?.make} {car?.model} {car?.year}
              </Typography>
              <Button
                className="remove-car-button"
                startIcon={<DeleteIcon className="delete-icon" />}
                onClick={handleDeleteClick}
              />
            </Box>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              License Plate: {car?.id} <br />
              Package: {car?.package} <br />
              Color: {car?.color || "-"} <br />
              Category: {car?.category} <br />
              Mileage: {car?.mileage || 0} <br />
              Price: {formatPrice(car?.price)}
            </Typography>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalDetailCar;
