import { Box, Modal, Typography } from "@mui/material";
import formatPrice from "../util/formatPrice";
import { Car } from "../models/car";

interface ModalDetailCarProps {
  car: Car | null;
  open: boolean;
  onClose: () => void;
}

const ModalDetailCar: React.FC<ModalDetailCarProps> = ({
  car,
  open,
  onClose,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-container">
        <Typography id="modal-modal-title" variant="h4" component="h2">
          {car?.make} {car?.model} {car?.year}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          License Plate: {car?.id} <br />
          Package: {car?.package} <br />
          Color: {car?.color} <br />
          Category: {car?.category} <br />
          Mileage: {car?.mileage} <br />
          Price: {formatPrice(car?.price)}
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalDetailCar;
