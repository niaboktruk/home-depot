import { useState } from "react";
import { Car } from "../models/car";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import formatPrice from "../util/formatPrice";
import CarDetailModal from "./ModalDetailCar";

interface CarListProps {
  cars: Car[];
  onDelete: (carId: string) => void;
}

const CarList: React.FC<CarListProps> = ({ cars, onDelete }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const handleOpenModal = (car: Car) => {
    setSelectedCar(car);
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
  };

  return (
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
        {cars.length === 0 ? (
          <Card>
            <CardHeader title={"No cars found"} />
          </Card>
        ) : (
          cars.map((car: Car) => (
            <Grid
              item
              sx={{ minWidth: "300px" }}
              sm={6}
              md={4}
              lg={3}
              key={car.id}
              onClick={() => handleOpenModal(car)}
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
          ))
        )}
      </Grid>
      <CarDetailModal
        car={selectedCar}
        open={!!selectedCar}
        onClose={handleCloseModal}
        onDelete={onDelete}
      ></CarDetailModal>
    </div>
  );
};

export default CarList;
