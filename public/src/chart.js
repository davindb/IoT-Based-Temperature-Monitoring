const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Suhu Belitan",
        data: [],
        backgroundColor: "transparent",
        borderColor: "rgb(220, 0, 0)",
        borderWidth: 4,
        tension: 0.3,
      },
      {
        label: "Suhu Inti Besi",
        data: [],
        backgroundColor: "transparent",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 4,
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
