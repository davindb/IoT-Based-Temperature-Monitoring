import express from "express";

const router = express.Router();

const temperatures = [
  {
    temp_belitan: "5",
    temp_intibesi: "15",
  },
];

router.get("/", (req, res) => {
  res.send(temperatures);
});

router.post("/", (req, res) => {
  const data = req.body;
  console.log(data);
  temperatures.push(data);
  res.send(data);
});

export default router;
