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
};

const buttonSticker = () => {
  createStickerElement()
};

const buttonSave = () => {
  console.log(`pressed Save button; len(allElements): ${allElements.value.length}`);
  // alles auf der Canvas zusammenfügen und als Bild in die session storage

  window.dispatchEvent(new Event('saveImage')); //send update to Meowsterpeace.vue
};

//button functionality
const createTextElement = () => { //type = "text"
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
};

const createStickerElement = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = "public/user1-128x128.jpg"; //sticker muss immer kleiner sein, als das hintergrundbild
  img.onload = () => {
    const sticker = {type:"sticker",image:img,x:10,y:10};
    allElements.value.push(sticker);
    drawSticker(ctx, sticker)
    makeMovable(canvas)
  };
}

const drawSticker = (context, sticker) => {
  context.drawImage(sticker.image, sticker.x, sticker.y);
  console.log("Sticker draw call");
}

//canvas methods
const redrawCanvas = () => { // also usable as reset
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = image.value;
  img.onload = () => { // needed, so resizing works reliably
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img,0,0, canvas.width, canvas.height);
    allElements.value.forEach(element => {
      if (element.type == "sticker") {
        drawSticker(ctx,element);
      }
    });
  }
  console.log("redrew canvas");
};

const makeMovable = (canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleFactorX = canvas.width / rect.width;
  const scaleFactorY = canvas.height / rect.height;
  var isDraggable = false;

  canvas.onmousedown = function(event) {
    cursorX.value = (event.clientX - rect.left) * scaleFactorX;
    cursorY.value = (event.clientY - rect.top) * scaleFactorY;
    allElements.value.forEach(element => {
      if (isPointInsideElement(cursorX.value, cursorY.value, element)) {
        selectedElement.value = element;
        console.log("selected Element")
        isDraggable = true;
      }
    });
  };

  canvas.onmousemove = function(event) {
    if (isDraggable) {
      cursorX.value = (event.clientX - rect.left) * scaleFactorX;
      cursorY.value = (event.clientY - rect.top) * scaleFactorY;
      selectedElement.value.x = cursorX.value
      selectedElement.value.y = cursorY.value
    }
  };

  canvas.onmouseup = function(event) {
    cursorX.value = (event.clientX - rect.left) * scaleFactorX;
    cursorY.value = (event.clientY - rect.top) * scaleFactorY;
    if (isDraggable) {
      selectedElement.value.x = cursorX.value - selectedElement.value.image.width/2;
      selectedElement.value.y = cursorY.value - selectedElement.value.image.height/2;
      redrawCanvas();
    }
    isDraggable = false;
  };

  canvas.onmouseout = function(e) {
    isDraggable = false;
  };
}

const isPointInsideElement = (pointX, pointY, element) => {
  return (
      pointX >= element.x &&
      pointX <= element.x + element.image.width &&
      pointY >= element.y &&
      pointY <= element.y + element.image.height
  );
};

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
