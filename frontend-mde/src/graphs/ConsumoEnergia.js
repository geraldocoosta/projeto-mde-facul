export default (tituloGraph, consumo) => {
  debugger;
  const dataGraph = consumo.map(c => c.consumoEnergetico);
  const labels = consumo.map(c => c.dia);
  const backgroundColor = "rgba(54,73,93,.5)";
  const borderColor = "#36495d";

  return {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: tituloGraph,
          data: dataGraph,
          backgroundColor,
          borderColor,
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }
        ]
      }
    }
  };
};
