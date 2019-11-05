export default (tituloGraph, consumo) => {
  const dataGraph = consumo.map(c => c.acumulativo);
  const labels = consumo.map(() => "");
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
      legend: {
        display: false
      }
    }
  };
};
