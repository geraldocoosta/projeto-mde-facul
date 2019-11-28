<template>
  <div class="mt-5" id="comparar-mensuracoes">
    <div class="d-flex justify-content-center mb-3">
      <h2>Seu gasto com energia</h2>
    </div>
    <div>
      <b-row>
        <b-col cols="2">
          <b-form-group label="Seus aparelhos salvos">
            <b-form-checkbox-group
              v-model="aparelhos"
              :options="aparelhosOptions"
              stacked
              buttons
            ></b-form-checkbox-group>
          </b-form-group>
        </b-col>
        <b-col cols="10">
          <grafico-comparar-energia :comparar="aparelhos" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import GraficoCompararEnergia from "../components/GraficoCompararEnergia";

export default {
  data() {
    return {
      aparelhos: [],
      aparelhosOptions: []
    };
  },
  components: {
    GraficoCompararEnergia
  },
  methods: {
    buscarAparelhosSalvos() {
      let nomeAparelhos = Object.keys(
        JSON.parse(localStorage.getItem("aparelhos"))
      );
      this.aparelhosOptions = nomeAparelhos.map(key => {
        return { text: key, value: key };
      });
    }
  },
  created() {
    this.buscarAparelhosSalvos();
  }
};
</script>

<style>
legend {
  font-size: 1.5em !important;
}
</style>
