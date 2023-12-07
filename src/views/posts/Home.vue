<!-- Home.vue -->
<template>
  <div>
    <h1 class="catchphrase">Let`s get those Cats <br> memed up!</h1>

    <router-link to="/CatMemeGenerator">
      <button class="styled-button">Start generating</button>
    </router-link>

  </div>
</template>

<script setup>
</script>

<style scoped>
/* Stil des Button */
.styled-button {
  background-color: #63775B;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

/* Stil der Catchphrase */
.catchphrase {
  color: white;
  font-family: 'DialogInput';
  font-size: 45px;
  margin-bottom: 20px;
}
</style>
