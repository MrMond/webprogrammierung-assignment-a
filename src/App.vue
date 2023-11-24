<script setup>

</script>

<template>
  <header>

    <div class="wrapper">
          <h3>App.vue nur noch zum Stylen und größere Komponenten verwenden!<br>
           Ansonsten in den views arbeiten, dazu router-view component verwenden und in main.js routing definieren<br>
          Mit 'router-link to="xxx" kann man dann buttons mit links versehen'</h3>
    </div>
  </header>
  <!--<main style="border: 1px dotted cornflowerblue; width:60%; ">
    <router-view></router-view>  Die hier werden über router/index.js generiert. Die .vue files sind in /views
  </main>-->
</template>

<style scoped>
header {
  line-height: 2.0;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
