import express from "express";

// begin:: TES
// const jsonFile = require("jsonfile");
// const fs = require("fs");
// var obj = {
//   table: [],
// };
// obj.table.push({ id: 1, square: 2 });
// end:: TES

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
  // begin:: TES
  // const json = JSON.stringify(data);
  // fs.readFile("myjsonfile.json", "utf8", function readFileCallback(err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     // obj = JSON.parse(data); //now it an object
  //     // obj.table.push(data); //add some data
  //     // json = JSON.stringify(obj); //convert it back to json
  //     fs.writeFile("myjsonfile.json", json, "utf8", (err) => {
  //       if (err) console.log(err);
  //       else {
  //         console.log("File written successfully\n");
  //         console.log("The written has the following contents:");
  //         console.log(fs.readFileSync("books.txt", "utf8"));
  //       }
  //     }); // write it back
  //   }
  // });
  // end:: TES
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
