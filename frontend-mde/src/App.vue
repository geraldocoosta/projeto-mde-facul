<template>
  <div id="app">
    <Header />
    <div class="container">
      <home />
    </div>
  </div>
</template>
<script>
import Home from "@/views/Home";
import Header from "@/components/Header";
export default {
  components: {
    Header,
    Home
  }
};
</script>
<style></style>
