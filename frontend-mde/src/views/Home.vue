<template>
  <div id="home">
    <div>
      <b-row class="my-1">
        <b-input-group class="mt-3">
          <b-form-input
            v-model="nomeAparelho"
            id="nome-aparelho"
            placeholder="Nome do aparelho"
          ></b-form-input>
          <b-input-group-append>
            <b-button
              variant="outline-success"
              v-if="sucess"
              @click="salvarLocalStorage"
              >Salvar aferição</b-button
            >
          </b-input-group-append>
        </b-input-group>
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
      :aparecerParar="!!timer"
      @parar="onPararTimer"
      @changeSucess="changeSucess"
    />
    <hr />
    <b-table
      @row-clicked="onRowClicked"
      hover
      :items="aparelhosAferidos"
    ></b-table>
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
      timer: 0,
      tempoVerificacao: null,
      nomeAparelho: null,
      sucess: false,
      aparelhosAferidos: null
    };
  },
  components: {
    GraficoConsumoEnergia
  },
  methods: {
    onRowClicked(item) {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      this.consumo = aparelhos[item.aparelhos];
      console.log(this.consumo);
      this.$bus.$emit("novaEmissao");
      this.sucess = true;
    },
    salvarLocalStorage() {
      if (this.nomeAparelho) {
        let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
        aparelhos[this.nomeAparelho] = this.consumo;
        localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
        this.resetConsumo();
      } else {
        document.querySelector("#nome-aparelho").classList.add("invalid");
        setTimeout(() => {
          document.querySelector("#nome-aparelho").classList.remove("invalid");
        }, 5000);
      }
    },
    resetConsumo() {
      this.consumo = [];
      this.timer = null;
      this.sucess = false;
      this.nomeAparelho = "";
      this.tempoVerificacao = null;
    },
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
      this.timer = setTimeout(
        this.buscaInformacoesCadaSegundo,
        tempoRequisicao
      );
    },
    submitFile() {
      this.sucess = true;
      this.buscaInformacoesCadaSegundo();
    }
  },
  created() {
    let nomeAparelhos = Object.keys(
      JSON.parse(localStorage.getItem("aparelhos"))
    );
    this.aparelhosAferidos = nomeAparelhos.map(key => {
      return { aparelhos: key };
    });
  }
};
</script>

<style scoped>
#home {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.invalid {
  border-color: #dc3545 !important;
}
</style>
