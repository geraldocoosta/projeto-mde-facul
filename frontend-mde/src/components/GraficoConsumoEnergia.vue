<template>
  <div id="consumoEnergia">
    <h2>Seu consumo de energia (Wh)</h2>
    <div>
      <div>
        <canvas id="consumo-energia"></canvas>
      </div>
      <b-button variant="primary" @click="voltar">Voltar</b-button>
      <b-button variant="danger" v-if="aparecerParar" @click="parar">
        Parar
      </b-button>
      <b-button v-b-modal.modal-salvar-medicao v-else variant="success"
        >Salvar Medicao
      </b-button>
    </div>
    <b-modal
      ref="modal-salvar-medicao"
      hide-footer
      id="modal-salvar-medicao"
      title="Intervalo de amostra"
    >
      <div class="small alerta" v-if="erroValidacao">
        <span>
          Digite um nome valido!
        </span>
      </div>
      <p class="my-4">
        Digite o nome do aparelho!
      </p>
      <b-form-input
        id="nome-aparelho"
        type="text"
        v-model="nomeAparelho"
        placeholder="Entre com o nome do aparelho"
      />
      <hr />
      <b-button variant="primary" @click="salvarMedicao">
        Salvar medição
      </b-button>
    </b-modal>
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
  data() {
    return {
      chart: null,
      nomeAparelho: "",
      erroValidacao: false
    };
  },
  methods: {
    voltar() {
      if (this.chart) {
        this.chart.destroy();
      }
      this.$emit("changeSucess");
    },
    parar() {
      this.$emit("parar");
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
    },
    validarCampo() {
      return this.nomeAparelho === "" || !this.nomeAparelho;
    },
    salvarMedicao() {
      if (this.validarCampo()) {
        this.erroValidacao = true;
        document.querySelector("#nome-aparelho").classList.add("invalid");
        setTimeout(() => {
          document.querySelector("#nome-aparelho").classList.remove("invalid");
          this.erroValidacao = false;
        }, 5000);
        return;
      }
      this.$emit("salvarMedicao", this.nomeAparelho);
      this.$refs["modal-salvar-medicao"].hide();
    }
  },
  mounted() {
    this.$bus.$on("novaEmissao", consumo => {
      this.createChart(
        "consumo-energia",
        consumoEnergiaGraph("consumo", consumo)
      );
    });
  }
};
</script>
<style scoped>
.invalid {
  border-color: #dc3545 !important;
}
.alerta {
  background-color: #dc354577;
  width: 75%;
  font-size: 1.2em;
  padding-left: 1em;
  border-radius: 10px;
  height: 2em;
}
</style>
