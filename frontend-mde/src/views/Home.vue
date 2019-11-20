<template>
  <div id="home">
    <div>
      <b-row class="my-1">
        <b-form-input
          v-model="nomeAparelho"
          placeholder="Nome do aparelho"
        ></b-form-input>
      </b-row>
      <b-row class="my-1" v-if="!sucess">
        <b-form-input
          type="number"
          v-model.number="tempoVerificacao"
          placeholder="Tempo em segundos para verificação"
        ></b-form-input>
      </b-row>
      <b-button v-if="!sucess" variant="primary" v-on:click="submitFile()"
        >Começar medição</b-button
      >
    </div>
    <grafico-consumo-energia
      v-if="sucess"
      :consumo="consumo"
      :aparecerParar="timer !== null"
      @parar="onPararTimer"
      @changeSucess="changeSucess"
    />
  </div>
</template>

<script>
import axios from "axios";
import GraficoConsumoEnergia from "@/components/GraficoConsumoEnergia";

export default {
  name: "home",
  data() {
    return {
      consumo: [],
      timer: null,
      tempoVerificacao: null,
      nomeAparelho: null,
      sucess: false
    };
  },
  components: {
    GraficoConsumoEnergia
  },
  methods: {
    onPararTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    changeSucess() {
      this.sucess = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    buscaInformacoes() {
      axios
        .get("http://localhost:3000/buscar-energia")
        .then(res => {
          this.consumo.push(res.data);
          this.$bus.$emit("novaEmissao");
        })
        .catch(() => console.log("failure"));
    },
    buscaInformacoesCadaSegundo() {
      let tempoRequisicao = this.tempoVerificacao * 1000 || 1000;
      this.buscaInformacoes();
      this.timer = setTimeout(this.buscaInformacoesCadaSegundo, tempoRequisicao);
    },
    submitFile() {
      this.sucess = true;
      this.buscaInformacoesCadaSegundo();
    }
  }
};
</script>

<style>
#home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
