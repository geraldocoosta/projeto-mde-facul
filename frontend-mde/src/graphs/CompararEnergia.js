export default (tituloGraph, comparacao) => {
  let labels = comparacao.map(c => c.aparelho);
  let dataGraph = comparacao.map(c => c.acumulado);
  const backgroundColor = "rgba(54,73,93,.5)";
  const borderColor = "#36495d";

  return {
    type: "bar",
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
