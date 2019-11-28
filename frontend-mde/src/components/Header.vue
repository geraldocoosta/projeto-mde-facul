<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav>
        <b-nav-item @click="inicio">MDE</b-nav-item>
        <b-nav-item @click="comparacao">Comparar</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    inicio() {
      this.$router.push({ name: "home" });
    },
    comparacao() {
      this.$router.push({ name: "comparar" });
    }
  }
};
</script>
