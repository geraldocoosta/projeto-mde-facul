<template>
  <div id="home">
    <div>
      <b-button v-if="!sucess" variant="primary" v-b-modal.modal-tempo-medicao>
        Começar medição
      </b-button>
    </div>
    <b-row v-if="sucess">
      <b-col cols="10">
        <grafico-consumo-energia
          :consumo="consumo"
          :aparecerParar="!!timer"
          @parar="onPararTimer"
          @changeSucess="changeSucess"
          @salvarMedicao="salvarLocalStorage"
        />
      </b-col>
      <b-col cols="2" class="mt-5">
        <h1>Seu consumo é de ≅ R${{ valorReais }}</h1>
      </b-col>
    </b-row>
    <b-table
      @row-clicked="onRowClicked"
      hover
      class="mt-3"
      striped
      :fields="aparelhosAferidosFields"
      :items="aparelhosAferidos"
    >
      <template v-slot:cell(acoes)="data">
        <button
          class="btn btn-danger float-right"
          @click="excluirAparelhos(data)"
        >
          X
        </button>
      </template>
    </b-table>
    <b-modal
      ref="modal-tempo-medicao"
      hide-footer
      id="modal-tempo-medicao"
      title="Intervalo de amostra"
    >
      <p class="my-4">
        Digite o intervalo de segundos para ser apresentado gráficamente!
      </p>
      <b-form-input
        type="number"
        v-model.number="tempoVerificacao"
        placeholder="Entre com a quantidade em segundos"
      />
      <hr />
      <b-button variant="primary" @click="comecarMedicao">
        Começar Medição
      </b-button>
    </b-modal>
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
      valor: 0,
      tempoVerificacao: 1,
      nomeAparelho: null,
      sucess: false,
      aparelhosAferidos: null,
      aparelhosAferidosFields: [
        { key: "aparelhos", label: "Aparelhos" },
        {
          key: "acoes",
          label: "Ações",
          tdClass: "d-flex justify-content-center"
        }
      ]
    };
  },
  components: {
    GraficoConsumoEnergia
  },
  computed: {
    valorReais() {
      return (this.valor * 0.000557).toFixed(4);
    }
  },
  methods: {
    onRowClicked(item) {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      this.consumo = aparelhos[item.aparelhos];
      this.sucess = true;
      this.valor = Math.max.apply(null, this.consumo.map(c => c.acumulativo));
      setTimeout(() => {
        this.$bus.$emit("novaEmissao", this.consumo);
      }, 300);
    },
    salvarLocalStorage(nomeAparelho) {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      aparelhos[nomeAparelho] = this.consumo;
      localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
      this.resetConsumo();
      this.buscarAparelhosSalvos();
      this.sucess = false;
    },
    resetConsumo() {
      this.timer = null;
      this.nomeAparelho = "";
      this.tempoVerificacao = 1;
    },
    onPararTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.resetConsumo();
      }
    },
    changeSucess() {
      this.sucess = false;
      this.consumo = [];
      this.$bus.$emit("novaEmissao", this.consumo);
      this.valor = 0;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    excluirAparelhos({ item }) {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos"));
      delete aparelhos[item.aparelhos];
      localStorage.setItem("aparelhos", JSON.stringify(aparelhos));
      this.buscarAparelhosSalvos();
    },
    buscaInformacoes() {
      axios
        .get("http://localhost:3000/buscar-energia")
        .then(res => {
          this.valor = res.data.acumulativo;
          this.consumo.push(res.data);
          this.$bus.$emit("novaEmissao", this.consumo);
        })
        .catch(() => console.log("failure"));
    },
    buscaInformacoesCadaSegundo() {
      let tempoRequisicao = this.tempoVerificacao * 1000 || 1000;
      this.timer = setInterval(this.buscaInformacoes, tempoRequisicao);
    },
    comecarMedicao() {
      this.$refs["modal-tempo-medicao"].hide();
      this.sucess = true;
      this.consumo = [];
      setTimeout(() => {
        this.$bus.$emit("novaEmissao", this.consumo);
        this.buscaInformacoesCadaSegundo();
      }, 300);
    },
    buscarAparelhosSalvos() {
      let nomeAparelhos = Object.keys(
        JSON.parse(localStorage.getItem("aparelhos"))
      );
      this.aparelhosAferidos = nomeAparelhos.map(key => {
        return { aparelhos: key };
      });
    }
  },
  created() {
    this.buscarAparelhosSalvos();
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
</style>
