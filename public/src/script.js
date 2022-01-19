const url = `http://localhost:5000/temperatures`;
const konstantaMinyak = 1.7749;
let tempData, currTemp, tempAtas, tempSamping, tempMinyak, selectedTemp;
setInterval(function () {
  $.ajax({
    url: url,
    method: "GET",
    datatype: "jsonp",
    headers: {
      "X-Parse-Application-Id": "MyAPPID",
      "Content-Type": "application/json",
    },
    async: false,
  })
    .done((data) => {
      tempData = data;
      currTemp = data[data.length - 1];
    })
    .fail((err) => {
      console.log(err);
    });
  currTemp = tempData[tempData.length - 1];
  tempAtas = Number(currTemp.temp_atas);
  tempSamping = Number(currTemp.temp_samping);
  tempMinyak = ((tempAtas + tempSamping) / 2) * konstantaMinyak;
  tempMinyak = Math.round(tempMinyak);
  selectedTemp = tempAtas >= tempSamping ? tempAtas : tempSamping;
  $("#temp_stat_atas").text(`${tempAtas} °C`);
  $("#temp_stat_samping").text(`${tempSamping} °C`);
  $("#temp_stat_minyak").text(`${tempMinyak} °C`);

  statusCheck(currTemp.temp_status);
}, 500);

function indikator(num) {
  [1, 2, 3, 4].forEach((el) => {
    $(`#ind_${el}_stat`).text("OFF");
    $("#fan_stat").text("OFF");
    $("#led_fan").css({ background: "rgb(255,255,255)" });

    if (el === num) {
      $(`#ind_${el}_stat`).text("ON");
    }

    if (num >= 3) {
      $("#fan_stat").text("ON");
      $("#led_fan").css({ background: "rgb(215,215,215)" });
    }
  });
}

// function turnOnLED(color) {
//   if (color === "white") {
//     $("#led_white").css({ background: "rgb(215,215,215)" });
//     $("#led_green").css({ background: "rgb(255,255,255)" });
//     $("#led_yellow").css({ background: "rgb(255,255,255)" });
//     $("#led_red").css({ background: "rgb(255,255,255)" });
//   }
// }

function statusCheck(tempStatus) {
  if (tempStatus === "Normal") {
    $("#status_stat").text("NORMAL");
    $("#status_card").css({ background: "rgb(0, 255, 0)" });
    $(".led_color").css({ background: "rgb(255,255,255)" });
    $("#led_green").css({ background: "rgb(215,215,215)" });

    indikator(2);
  } else if (tempStatus === "Warning") {
    $("#status_stat").text("WARNING");
    $("#status_card").css({ background: "rgb(255, 255, 0)" });
    $(".led_color").css({ background: "rgb(255,255,255)" });
    $("#led_yellow").css({ background: "rgb(215,215,215)" });
    indikator(3);
  } else if (tempStatus === "Emergency") {
    $("#status_stat").text("EMERGENCY");
    $("#status_card").css({ background: "rgb(255, 0, 0)" });
    $(".led_color").css({ background: "rgb(255,255,255)" });
    $("#led_red").css({ background: "rgb(215,215,215)" });
    indikator(4);
  } else {
    $("#status_stat").text("NOT DETECTED");
    $("#status_card").css({ background: "rgb(215,215,215)" });
    $(".led_color").css({ background: "rgb(255,255,255)" });
    $("#led_white").css({ background: "rgb(215,215,215)" });
  }
}

function tempClick(e) {
  e.preventDefault();
}

setInterval(function () {
  // Updating chart
  const maxDataLength = 20;
  let init;
  tempData.length < maxDataLength
    ? (init = 0)
    : (init = tempData.length - maxDataLength);
  const chartTemp = tempData.slice(init, tempData.length);
  const chartLabels = chartTemp.map(
    (el) => new Date(el.date).toTimeString().split(" ")[0]
  );
  const chartAtas = chartTemp.map((el) => el.temp_atas);
  const chartSamping = chartTemp.map((el) => el.temp_samping);

  myChart.data.labels = chartLabels;
  myChart.data.datasets[0].data = chartAtas;
  myChart.data.datasets[1].data = chartSamping;
  myChart.update("resize");
}, 500);
