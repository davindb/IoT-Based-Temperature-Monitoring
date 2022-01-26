import express from "express";

const router = express.Router();

let temperatures = [];

router.get("/", (req, res) => {
  res.send(temperatures);
});

router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  data.date = new Date().toISOString();

  // begin:: Clear resource
  if (temperatures.length === 40) {
    temperatures = temperatures.slice(
      temperatures.length - 19,
      temperatures.length
    );
  }
  // end:: Clear resource

  temperatures.push(data);
  res.send(data);
});

router.delete("/", (req, res) => {
  temperatures = [];
  res.send(temperatures);
});

export default router;
