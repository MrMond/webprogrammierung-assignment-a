<script setup>
import { ref } from 'vue';
</script>

<template>
  <div>
    <h1 class="catchphrase">Let`s get those Cats <br> memed up!</h1>


    <router-link to="/CatMemeGenerator">
      <button class="styled-button">Start generating</button>
    </router-link>
  </div>
</template>

<style scoped>
/* Style des Button */
.styled-button {
  background-color: #63775B;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
</style>

<style scoped>
.catchphrase {
  color: white;
  font-weight: bold;
  font-family: '72 Black', cursive;
  font-size: 45px; 
  margin-bottom: 20px;
}
</style>


