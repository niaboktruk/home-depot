import { Car } from "../models/car"

const BASE_URL = 'http://localhost:3001/cars'

export const fetchCars = async (): Promise<Car[]> => {
  const response = await fetch(BASE_URL)
  if (!response.ok) {
    throw new Error('Server Error')
  }
  const data = await response.json();
  return data.data as Car[];
}

export const createCar = async (newCar: Car): Promise<Car> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newCar)
  })

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Server Error');
  }
  const data = await response.json();
  return await data.data as Car;
}
