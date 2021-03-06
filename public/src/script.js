const url = `https://sistem-monitoring-suhu-iot.herokuapp.com/temperatures`;

const konstantaMinyak = 1.7749;
let tempData,
  currTemp,
  tempAtas,
  tempSamping,
  tempMax,
  tempMinyak,
  delayTime,
  lastLen,
  currLen;

let delayTimeArr = [];
lastLen = Number(window.localStorage.lastLen);
if (!window.localStorage.lastLen) {
  lastLen = 0;
  localStorage.setItem("lastLen", lastLen);
}

let stopSystemCount = Number(window.localStorage.stopSystemCount);
if (!window.localStorage.stopSystemCount) {
  stopSystemCount = 0;
  localStorage.setItem("stopSystemCount", stopSystemCount);
}

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
    })
    .fail((err) => {
      console.log(err);
    });

  currTemp = tempData[tempData.length - 1];
  if (!currTemp) {
    return;
  }

  currLen = tempData.length;

  if (lastLen === currLen) {
    if (stopSystemCount >= 10) {
      tempData = [];
      indikator(0);
      $("#status_stat").text("SYSTEM IS OFF");
      $("#status_card").css({ background: "rgb(215,215,215)" });
      $("#temp_stat_atas").text("OFF");
      $("#temp_stat_samping").text("OFF");
      $("#temp_stat_minyak").text("NONE");
      $(".led_color").css({ background: "rgb(255,255,255)" });
      return;
    }
    stopSystemCount++;
    localStorage.setItem("stopSystemCount", stopSystemCount);
    return;
  }

  stopSystemCount = 0;
  localStorage.setItem("stopSystemCount", stopSystemCount);
  lastLen = tempData.length;
  localStorage.setItem("lastLen", lastLen);

  // begin:: Calculate the delay time
  delayTime = new Date() - new Date(currTemp.date);
  if (String(delayTime).length >= 2) {
    delayTime = String(delayTime).slice(
      String(delayTime).length - 2,
      String(delayTime).length
    );
    delayTime = Number(delayTime);
  }

  // begin:: Clear resource
  if (delayTimeArr.length >= 40) {
    delayTimeArr = delayTimeArr.slice(
      delayTimeArr.length - 19,
      delayTimeArr.length
    );
  }
  // end:: Clear resource

  // console.log(`Current Delay: ${delayTime}`);
  delayTimeArr.push(delayTime);
  const sum = delayTimeArr.reduce((a, b) => a + b, 0);
  const delayTimeAvg = sum / delayTimeArr.length || 0;
  console.log(`Avg Delay: ${delayTimeAvg}`);
  // end:: Calculate the delay time

  currTemp = tempData[tempData.length - 1];
  tempAtas = Number(currTemp.temp_atas);
  tempSamping = Number(currTemp.temp_samping);
  tempMax = tempAtas >= tempSamping ? tempAtas : tempSamping;
  tempMinyak = tempMax * konstantaMinyak;
  tempMinyak = Math.round(tempMinyak);

  if (currTemp.temp_status === "undefined") {
    tempAtas = tempAtas > 1000 ? "NOT DETECTED" : `${tempAtas} ??C`;
    tempSamping = tempSamping > 1000 ? "NOT DETECTED" : `${tempSamping} ??C`;
    tempMinyak = "NONE";
  }
  $("#temp_stat_atas").text(
    currTemp.temp_status != "undefined" ? `${tempAtas} ??C` : tempAtas
  );
  $("#temp_stat_samping").text(
    currTemp.temp_status != "undefined" ? `${tempSamping} ??C` : tempSamping
  );
  $("#temp_stat_minyak").text(
    currTemp.temp_status != "undefined" ? `${tempMinyak} ??C` : tempMinyak
  );

  statusCheck(currTemp.temp_status);

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
    indikator(1);
  }
}

function tempClick(e) {
  e.preventDefault();
}
