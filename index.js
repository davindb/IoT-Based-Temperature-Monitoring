import express from "express";
import usersRoutes from "./routes/temperatures.js";
import { fileURLToPath } from "url";
// console.log(import.meta.url);
// import.meta.url = file:///C:/Users/Davin/Documents/Web%20Development/Node/index.js
const __dirname = fileURLToPath(
  "file:///C:/Users/Davin/Documents/Web%20Development/IoT/IoT-Based-Temperature-Monitoring"
);

const app = express();
app.use(express.static("public"));

const PORT = 5000;

app.use(express.json());

app.use("/temperatures", usersRoutes);

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

app.listen(PORT, () =>
  console.log(`Server is running on port: http://localhost:${PORT}`)
);
