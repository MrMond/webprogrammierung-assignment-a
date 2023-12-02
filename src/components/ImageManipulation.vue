<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const image = ref(sessionStorage.getItem('uploadedImage'));
const imageAvailable = ref(!!image.value);
const updateImage = () => {
  image.value = sessionStorage.getItem('uploadedImage');
  imageAvailable.value = !!image.value;
  redrawCanvas()
  console.log("updated image")
};

const updateDisplayEventListener = () => {
  console.log("received picture")
  updateImage();
};

const buttonText = () => {
  console.log("pressed Text button")
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
};

const buttonSticker = () => {
  console.log("pressed Sticker button")
}

const buttonMeowgic = () => {
  console.log("pressed Meowgic button")
}

const redrawCanvas = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = image.value;
  img.onload = () => { // needed, so resizing works reliably
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
  }

  console.log("redrew canvas")
}

onMounted(() => {
  window.addEventListener('updateDisplay', updateDisplayEventListener);
  if (imageAvailable.value) {
    redrawCanvas()
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('updateDisplay', updateDisplayEventListener);
});
</script>

<template>
  <div class="button-container">
    <button @click="buttonText"> Text </button>
    <button @click="buttonSticker"> Sticker </button>
    <button @click="buttonMeowgic"> Meowgic </button>
  </div>
  <div class = "image-manipulation">
    <canvas id="canvas" width="0" height="00"></canvas>
  </div>
</template>

<style scoped>
.image-manipulation canvas {
  max-width: 100%;
  max-height: 2000px;
  background-color: rgba(255, 255, 255, 0.15);
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
