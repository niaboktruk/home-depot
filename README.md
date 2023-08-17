# Homedepot Car Listings

This project consists of a web application that allows users to view and manage car listings. The project is split into two main components:

1. **Client**: A React-based user interface.
2. **Server**: A Node.js backend API to manage car data.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

1. [Node.js](https://nodejs.org/)
2. [Docker](https://www.docker.com/) (Optional, for containerized deployment)

### Installation

1. Clone the repository:

	git clone https://github.com/niaboktruk/home-depot.git

2. Install dependencies for both the client and the server:

```
cd homedepot/client
yarn install
```

```
cd ../server
yarn install
```

## Running the Application

Start the server:

```
cd server
yarn run start
```

In another terminal, start the client:

```
cd client
yarn dev
```

Access the application at http://localhost:3000 and the server's API endpoints at http://localhost:3001.

## API Endpoints

```
GET /cars: Fetch all cars.
POST /cars: Add a new car.
```

## Docker Deployment

Navigate to the root directory (/homedepot).
Build and start the services:

```
docker-compose up --build
```

## Stop the services:

```
docker-compose down
```

## Contributing
Contributions are welcome! Please read our contributing guidelines to get started. In the moment we don't have any guidelines so feel free to improve the project!

## License
This project is licensed under the MIT License.
