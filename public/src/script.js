const url = `http://localhost:5000/temperatures`;
let tempData, currTemp, tempName, selectedTemp;
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

  if (!window.localStorage.temp_name) {
    localStorage.setItem("temp_name", 1);
  }

  tempName = Number(window.localStorage.temp_name);

  if (tempName === 1) {
    selectedTemp = currTemp.temp_belitan;
    tempName = "Suhu Belitan";
  } else {
    selectedTemp = currTemp.temp_intibesi;
    tempName = "Suhu Inti Besi";
  }

  $("#temp_name").text(`${tempName}`);
  $("#temp_stat").text(`${selectedTemp}°C`);

  statusCheck(selectedTemp);
}, 500);

function indikator(num) {
  [1, 2, 3, 4].forEach((el) => {
    $(`#ind_${el}_stat`).text("OFF");
    if (el === num) {
      $(`#ind_${el}_stat`).text("ON");
    }
    if (num >= 3) {
      $("#fan_stat").text("ON");
      return;
    }
    $("#fan_stat").text("OFF");
  });
}

function statusCheck(temp) {
  if (temp < 10) {
    $("#status_stat").text("NORMAL");
    $("#status_card").css({ background: "rgb(0, 255, 0)" });

    indikator(2);
  } else if (temp < 20) {
    $("#status_stat").text("WARNING");
    $("#status_card").css({ background: "rgb(255, 255, 0)" });
    indikator(3);
  } else {
    $("#status_stat").text("EMERGENCY");
    $("#status_card").css({ background: "rgb(255, 0, 0)" });
    indikator(4);
  }
}

function tempClick(e) {
  e.preventDefault();
  if (!window.localStorage.temp_name) {
    localStorage.setItem("temp_name", 1);
  }
  tempName = Number(window.localStorage.temp_name);
  if (tempName === 1) {
    selectedTemp = currTemp.temp_intibesi;
    tempName = "Suhu Inti Besi";
    localStorage.setItem("temp_name", 2);
  } else {
    selectedTemp = currTemp.temp_belitan;
    tempName = "Suhu Belitan";
    localStorage.setItem("temp_name", 1);
  }
  $("#temp_name").text(`${tempName}`);
  $("#temp_stat").text(`${selectedTemp}°C`);
  statusCheck(selectedTemp);
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
  const chartBelitan = chartTemp.map((el) => el.temp_belitan);
  const chartIntiBesi = chartTemp.map((el) => el.temp_intibesi);

  myChart.data.labels = chartLabels;
  myChart.data.datasets[0].data = chartBelitan;
  myChart.data.datasets[1].data = chartIntiBesi;
  myChart.update("resize");
}, 500);
