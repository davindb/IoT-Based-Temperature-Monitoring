import express from "express";

const router = express.Router();

const temperatures = [];

setInterval(function () {
  const temp_belitan = Math.round(Math.random() * 100);
  const temp_intibesi = Math.round(Math.random() * 100);
  const date = new Date().toISOString();

  const data = {
    temp_belitan,
    temp_intibesi,
    date,
  };

  temperatures.push(data);
}, 500);

router.get("/", (req, res) => {
  res.send(temperatures);
});

router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  data.date = new Date().toISOString();
  temperatures.push(data);
  res.send(data);
});

export default router;
