<template>
  <div>
    <b-row>
      <b-col cols="9">
        <div>
          <canvas id="consumo-energia"></canvas>
        </div>
      </b-col>
      <b-col>
        <h1>O valor dos aparelhos somados é ≅ R${{ totalGasto }}</h1>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Chart from "chart.js";

import compararEnergiaGraph from "@/graphs/CompararEnergia";

export default {
  props: {
    comparar: Array
  },
  data() {
    return {
      chart: null,
      valores: [],
      totalGasto: 0
    };
  },
  watch: {
    comparar() {
      this.mapearValores();
      this.createChart(
        "consumo-energia",
        compararEnergiaGraph("Comparação mensuracoes", this.valores)
      );
      this.valorTotal();
    }
  },
  methods: {
    valorTotal() {
      if (this.valores.length) {
        let kwSomado = this.valores
          .map(aparelho => Number(aparelho.acumulado))
          .reduce((acc, cur) => acc + cur);
        this.totalGasto = (kwSomado * 0.000557).toFixed(4);
      } else {
        this.totalGasto = 0;
      }
    },
    mapearValores() {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      this.valores = this.comparar.map(aparelho => {
        let mensuracao = aparelhos[aparelho];
        let acumulado = Math.max.apply(
          null,
          mensuracao.map(m => m.acumulativo)
        );
        return { aparelho, acumulado };
      });
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
