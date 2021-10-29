import express from "express";

const router = express.Router();

const temperatures = [];

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
