<template>
  <div id="app">
    <div v-if="!sucess">
      <b-form-file
        placeholder="Escolha um arquivo"
        :state="Boolean(file)"
        drop-placeholder="Escolha um arquivo"
        v-model="file"
      ></b-form-file>
      <div class="mt-3">Arquivo selecionado: {{ file ? file.name : "" }}</div>
      <button v-on:click="submitFile()">Submit</button>
    </div>
    <grafico-consumo-energia v-if="sucess" @changeSucess="changeSucess" />
  </div>
</template>

<script>
import axios from "axios";
import GraficoConsumoEnergia from "./components/GraficoConsumoEnergia";

export default {
  name: "app",
  data() {
    return {
      file: null,
      sucess: false
    };
  },
  components: {
    GraficoConsumoEnergia
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    changeSucess() {
      this.sucess = false;
    },
    submitFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      axios
        .post("http://localhost:3000/file/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(() => (this.sucess = true))
        .catch(() => console.log("failure"));
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
