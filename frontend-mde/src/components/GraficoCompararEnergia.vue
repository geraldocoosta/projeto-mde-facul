<template>
  <div>
    <canvas id="consumo-energia"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

import compararEnergiaGraph from "@/graphs/CompararEnergia";

export default {
  props: {
    comparar: Array
  },
  date() {
    return {
      chart: null
    };
  },
  watch: {
    comparar() {
      if (this.comparar.length) {
        this.mapearValores();
      } else {
        if (this.chart) {
          this.chart.destroy;
        }
      }
    }
  },
  methods: {
    mapearValores() {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      let teste = this.comparar.map(aparelho => {
        let mensuracao = aparelhos[aparelho];
        let acumulado = Math.max.apply(
          null,
          mensuracao.map(m => m.acumulativo)
        );
        return { aparelho, acumulado };
      });
      this.createChart("consumo-energia", compararEnergiaGraph("Bla", teste));
    },
    createChart(chartId, chartData) {
      if (this.chart) {
        this.chart.destroy();
      }
      const ctx = document.getElementById(chartId);
      this.chart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  }
};
</script>

<style></style>
