<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const image = ref(sessionStorage.getItem('uploadedImage'));
const imageAvailable = ref(!!image.value);

const updateImage = () => {
  image.value = sessionStorage.getItem('uploadedImage');
  imageAvailable.value = !!image.value;
};

const updateDisplayEventListener = () => {
  updateImage();
  console.log("updated picture")
};

const buttonText = () => {
  console.log("pressed Text button")
}

const buttonSubtitles = () => {
  console.log("pressed Subtitles button")
}

const buttonSticker = () => {
  console.log("pressed Sticker button")
}

const buttonMeowgic = () => {
  console.log("pressed Meowgic button")
}

onMounted(() => {
  window.addEventListener('updateDisplay', updateDisplayEventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('updateDisplay', updateDisplayEventListener);
});

</script>

<template>
  <div class="button-container">
    <button @click="buttonText"> Text </button>
    <button @click="buttonSubtitles"> Subtitles </button>
    <button @click="buttonSticker"> Sticker </button>
    <button @click="buttonMeowgic"> Meowgic </button>
  </div>
  <div v-if="imageAvailable"
       class = "image-manipulation"
  >
    <img :src="image" alt="Uploaded Image" />
  </div>
</template>

<style scoped>
.image-manipulation img {
  max-width: 100%;
  max-height: 2000px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.button-container button {
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>