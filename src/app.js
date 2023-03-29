const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const port = 3000;

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "hello from the server side", app: "Rent and Go" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post to this endpoint");
// });

const cars = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/cars.json`));

app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "success",
    results: cars.length,
    data: {
      cars: cars,
    },
  });
});

app.post("/api/v1/cars", (req, res) => {
  //   console.log(req.body);
  const newId = cars[cars.length - 1].id + 1;
  const newCar = Object.assign({ id: newId }, req.body);

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/dev-data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          car: newCar,
        },
      });
    }
  );
});

app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
