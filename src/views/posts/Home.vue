<!-- Home.vue -->
<template>
  

  <div v-if="isMini" class="container-small">
    <h1 class="catchphrase-small">Let`s get those Cats memed up!</h1>
    <router-link to="/CatMemeGenerator">
      <button class="styled-button">Start generating</button>
    </router-link>
  </div>

  <div v-else class="container-big">
    <h1 class="catchphrase-big">Let`s get those Cats <br> memed up!</h1>
    <router-link to="/CatMemeGenerator">
      <button class="styled-button">Start generating</button>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { name } = useDisplay()

const isMini = computed(() => {
  switch (name.value) {
    case 'xs': return true
    case 'sm': return false
    case 'md': return false
    case 'lg': return false
    case 'xl': return false
    case 'xxl': return false
  }
})

</script>


<style scoped>
/* Stil des Container */
.container-big {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Links ausrichten */
  align-items: start;
  height: 100vh; /* 100% der Bildschirmhöhe */
  width: 50%;    /* 50% der Bildschirmbreite */
  max-width: 50vw; /* Maximale Breite auf 50% der Bildschirmbreite begrenzen */
  padding-left: 10vw;
}

.container-small {
  display: flex;
  flex-direction: column;
  justify-content: top; /* Links ausrichten */
  align-items: center;
  height: 100vh; /* 100% der Bildschirmhöhe */
  width: 100%;    /* 50% der Bildschirmbreite */
  max-width: 100vw;
  
}

/* Stil des Button */
.styled-button {
  background-color: #63775B;
  color: #fff;
  padding: 10px 15px;
  border: none; 
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Arial', 'serif';
  font-size: 16px;
}

/* Stil der Catchphrase */
.catchphrase-small {
  color: white;
  font-family: 'Times New Roman', 'serif';
  font-size: 45px;
  margin-bottom: 45vh;
  margin-top: 10vh;
  text-align: center;
}

.catchphrase-big {
  color: white;
  font-family: 'Times New Roman', 'serif';
  font-size: 45px;
  margin-bottom: 20px;
  
}
</style>
