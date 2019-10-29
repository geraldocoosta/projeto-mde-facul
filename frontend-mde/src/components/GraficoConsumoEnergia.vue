<template>
  <div>
    <h1 class="mt-5">Oi</h1>
    <button @click="voltar">change</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      consumo: {}
    };
  },
  methods: {
    voltar() {
      this.$emit("changeSucess");
    }
  },
  created() {
    axios
      .get("http://localhost:3000/consumo-energia")
      .then(res => (this.consumo = res.data));
  }
};
</script>

<style></style>
