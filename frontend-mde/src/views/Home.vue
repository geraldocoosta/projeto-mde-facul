<template>
  <div id="home">
    <div>
      <b-button v-if="!sucess" variant="primary" v-b-modal.modal-tempo-medicao>
        Começar medição
      </b-button>
    </div>
    <grafico-consumo-energia
      v-if="sucess"
      :consumo="consumo"
      :aparecerParar="!!timer"
      @parar="onPararTimer"
      @changeSucess="changeSucess"
      @salvarMedicao="salvarLocalStorage"
    />
    <hr />
    <b-table
      @row-clicked="onRowClicked"
      hover
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
      tempoVerificacao: null,
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
  methods: {
    onRowClicked(item) {
      let aparelhos = JSON.parse(localStorage.getItem("aparelhos")) || {};
      this.consumo = aparelhos[item.aparelhos];
      console.log(this.consumo);
      this.$bus.$emit("novaEmissao", this.consumo);
      this.sucess = true;
    },
    salvarLocalStorage(nomeAparelho) {
      debugger;
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
      this.tempoVerificacao = null;
    },
    onPararTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.resetConsumo();
      }
    },
    changeSucess() {
      this.sucess = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        this.consumo = [];
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
          this.consumo.push(res.data);
          this.$bus.$emit("novaEmissao", this.consumo);
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
    comecarMedicao() {
      this.$refs["modal-tempo-medicao"].hide();
      this.sucess = true;
      this.buscaInformacoesCadaSegundo();
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
