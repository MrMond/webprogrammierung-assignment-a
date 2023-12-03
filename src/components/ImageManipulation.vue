<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
//setup of image
const image = ref(sessionStorage.getItem('uploadedImage'));
const imageAvailable = ref(!!image.value);
// drawing variables
const cursorX = ref(0);
const cursorY = ref(0);
const selectedElement = ref(null);
const allElements = ref([]);
const updateImage = () => {
  image.value = sessionStorage.getItem('uploadedImage');
  imageAvailable.value = !!image.value;
  redrawCanvas()
  console.log("updated image");
};

const updateDisplayEventListener = () => {
  console.log("received picture");
  updateImage();
};

//button listeners
const buttonText = () => {
  createTextElement();
  console.log("pressed Text button");
  ///////////////////////////////////
  //const canvas = document.getElementById("canvas");
  //const ctx = canvas.getContext("2d");
  //ctx.font = "50px sans-serif";
  //ctx.fillText("Click to edit", cursorX.value, cursorY.value);
};

const buttonSticker = () => {
  console.log("pressed Sticker button");
};

const buttonSave = () => {
  console.log("pressed Save button");
};

//button functionality
const createTextElement = () => {
  const canvas = document.getElementById("canvas");
  if (canvas) {
    //const textarea = document.createElement(('textarea'));
    //textarea.value = "Click to edit";
    //textarea.style.position = "absolute";
    //textarea.style.left = "10px";
    //textarea.style.top = "10px";
//
    //canvas.appendChild(textarea);
//
    //makeDraggable(textarea);

    allElements.value.push(textarea);
    selectedElement.value = textarea;
  }
};

//canvas methods
const redrawCanvas = () => {
  const canvas = document.getElementById("canvas");
  canvas.addEventListener("mousedown", function(e) {
    handleCanvasClick(e,canvas);
  });
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = image.value;
  img.onload = () => { // needed, so resizing works reliably
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
  }
  console.log("redrew canvas");
};

const handleCanvasClick = (event, canvas) => {
  //const canvas = document.getElementById("canvas");
  const rect = canvas.getBoundingClientRect();
  const scaleFactorX = canvas.width / rect.width;
  const scaleFactorY = canvas.height / rect.height;

  cursorX.value = (event.clientX - rect.left) * scaleFactorX;
  cursorY.value = (event.clientY - rect.top) * scaleFactorY;
  window.dispatchEvent(new Event('updateCursorPosition')); //maybe irrelevant
};

//const makeDraggable = (element) => { //// anschauen und überarbeiten
//  let isDragging = false;
//  let offsetX, offsetY;
//
//  element.addEventListener('mousedown', (e) => {
//    isDragging = true;
//    offsetX = e.clientX - element.getBoundingClientRect().left;
//    offsetY = e.clientY - element.getBoundingClientRect().top;
//
//    // Set the selected element
//    selectedElement.value = element;
//  });
//
//  document.addEventListener('mousemove', (e) => {
//    if (isDragging) {
//      const x = e.clientX - offsetX;
//      const y = e.clientY - offsetY;
//      element.style.left = `${x}px`;
//      element.style.top = `${y}px`;
//    }
//  });
//
//  document.addEventListener('mouseup', () => {
//    isDragging = false;
//  });
//};
//

//required for persistence
onMounted(() => {
  window.addEventListener('updateDisplay', updateDisplayEventListener);
  if (imageAvailable.value) {
    redrawCanvas();
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
    <button @click="buttonSave"> Save </button>
  </div>
  <div class = "image-manipulation">
    <canvas id="canvas" width="0" height="0"></canvas>
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
