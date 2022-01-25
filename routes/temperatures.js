import express from "express";

const router = express.Router();

let temperatures = [];

setInterval(function () {
  const temp_atas = Math.round(Math.random() * 100);
  const temp_samping = Math.round(Math.random() * 100);
  const temp_status = "Normal";
  const date = new Date().toISOString();

  const data = {
    temp_atas,
    temp_samping,
    temp_status,
    date,
  };
  console.log(data);

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

export default router;
