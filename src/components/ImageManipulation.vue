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
  console.log("pressed Save button");
};

//button functionality
const createTextElement = () => { //type = "text"
  const canvas = document.getElementById("canvas");
  if (canvas) {
    const textarea = null
    allElements.value.push(textarea);
    selectedElement.value = textarea;
  }
};

const createStickerElement = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = "public/user1-128x128.jpg"; //sticker muss immer kleiner sein, als das hintergrundbild
  img.onload = () => {
    const sticker = {type:"sticker",image:img,x:10+img.width,y:10+img.height};
    allElements.value.push(sticker);
    selectedElement.value = sticker;
    drawSticker(ctx, img)
    makeMovable(canvas)
  };
}

const drawSticker = (context, sticker) => {
  if (selectedElement.value !== null) {
    context.drawImage(sticker,
        selectedElement.value.x-(sticker.width/2),
        selectedElement.value.y-(sticker.height/2));
    console.log("Sticker draw call");
  }
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
        drawSticker(ctx,element.image);
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


    if (cursorX.value >= (selectedElement.value.x - selectedElement.value.image.width/2) && //error here
        cursorX.value <= (selectedElement.value.x + selectedElement.value.image.width/2) &&
        cursorY.value >= (selectedElement.value.y - selectedElement.value.image.height/2) &&
        cursorY.value <= (selectedElement.value.y + selectedElement.value.image.height/2)) {
      isDraggable = true;
    }
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
      if (selectedElement.value.type == "sticker") {
        selectedElement.value.x = cursorX.value
        selectedElement.value.y = cursorY.value
        redrawCanvas()
      }
      if(selectedElement.value.type == "text") {}
    }
    isDraggable = false;
  };

  canvas.onmouseout = function(e) {
    isDraggable = false;
  };
}

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
