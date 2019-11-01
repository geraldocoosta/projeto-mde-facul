<template>
  <div id="consumoEnergia">
    <h2>Seu consumo de energia</h2>
    <div>
      <div>
        <canvas id="consumo-energia"></canvas>
      </div>
      <b-button variant="primary" @click="voltar">Voltar</b-button>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";

import consumoEnergiaGraph from "@/graphs/ConsumoEnergia";

export default {
  props: {
    consumo: {
      required: true,
      type: Array
    }
  },
  methods: {
    voltar() {
      this.$emit("changeSucess");
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options
      });
    }
  },
  mounted() {
    this.createChart(
      "consumo-energia",
      consumoEnergiaGraph("Consumo por dia", this.consumo)
    );
  }
};
</script>

<style></style>
