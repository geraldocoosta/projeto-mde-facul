<template>
  <div id="consumoEnergia">
    <h2>Seu consumo de energia (kWh)</h2>
    <div>
      <div>
        <canvas id="consumo-energia"></canvas>
      </div>
      <b-button variant="primary" @click="voltar">Voltar</b-button>
      <b-button variant="danger" v-if="aparecerParar" @click="parar"
        >Parar</b-button
      >
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
    },
    aparecerParar: Boolean
  },
  methods: {
    voltar() {
      this.$emit("changeSucess");
    },
    parar() {
      this.$emit("parar");
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
      consumoEnergiaGraph("consumo", this.consumo)
    );
    this.$bus.$on("novaEmissao", () => {
      this.createChart(
        "consumo-energia",
        consumoEnergiaGraph("consumo", this.consumo)
      );
    });
  }
};
</script>
