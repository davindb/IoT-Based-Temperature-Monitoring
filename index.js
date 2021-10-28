import path from "path";
import express from "express";
import usersRoutes from "./routes/temperatures.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
