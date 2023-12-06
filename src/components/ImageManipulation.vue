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
  if(!!image.value) {
    createTextElement();
  }
};

const buttonSticker = () => {
  if(!!image.value) {
    createStickerElement()
  }
};

const buttonSave = () => {
  if (!!image.value) {
    try {
      console.log(`Number of saved Elements: ${allElements.value.length}`);
      const canvas = document.getElementById("canvas");
      const combinedImage = new Image();
      combinedImage.src = canvas.toDataURL();
      combinedImage.onload = () => {
        try {
          sessionStorage.setItem('uploadedImage', null);
          sessionStorage.setItem('uploadedImage', combinedImage.src);
          allElements.value = [];
          selectedElement.value = null;
        } catch (e) {
          console.log("Saving failed, cache full");
          alert("Your browser's cache overflowed. Try again with a smaller image.");
        }
        window.dispatchEvent(new Event('updateDisplay'));
        window.dispatchEvent(new Event('saveImage'));

        // Neues Event "openPostcardDetails" für die Gallery-Komponente auslösen
        const title = prompt("Enter the title for the new postcard:");
        if (title) {
          window.dispatchEvent(new CustomEvent('openPostcardDetails', { detail: { title, imgSrc: combinedImage.src } }));
        }

        alert("Saved your changes. The image is now available in the gallery.");
      };
    } catch (e) {
      console.log("Saving failed, cache full");
      alert("Your browser's cache overflowed. Try again with a smaller image.");
    }
  }
};


//button functionality
const createTextElement = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const text = "click to edit";
  const textarea = {type:"text",text:text,x:10,y:10,width:0,height:0};
  allElements.value.push(textarea);
  drawTextarea(ctx, textarea);
  makeMovable(canvas);
};

const createStickerElement = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = "public/user1-128x128.jpg"; //sticker muss immer kleiner sein, als das hintergrundbild
  img.onload = () => {
    const sticker = {type:"sticker",image:img,x:10,y:10};
    allElements.value.push(sticker);
    drawSticker(ctx, sticker);
    makeMovable(canvas);
  };
}

const drawSticker = (context, sticker) => {
  context.drawImage(sticker.image, sticker.x, sticker.y);
  console.log("Sticker draw call");
};

const drawTextarea = (context, textarea) => {
  const textSize = 50;
  context.font = `${textSize}px Lobster`;
  context.fillText(textarea.text,textarea.x,textarea.y+textSize);
  const textMetrics = context.measureText(textarea.text);
  textarea.height = textSize;
  textarea.width = textMetrics.width;
};

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
      switch (element.type) {
        case "sticker":
          drawSticker(ctx,element);
          break;
        case "text":
          drawTextarea(ctx,element)
          break;
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
      switch (selectedElement.value.type){
        case "sticker":
          selectedElement.value.x = cursorX.value - selectedElement.value.image.width/2;
          selectedElement.value.y = cursorY.value - selectedElement.value.image.height/2;
          break;
        case "text":
          selectedElement.value.x = cursorX.value - selectedElement.value.width/2;
          selectedElement.value.y = cursorY.value - selectedElement.value.height/2;
          break;
        default:
          selectedElement.value.x = cursorX.value;
          selectedElement.value.y = cursorY.value;
          break;
      }
      redrawCanvas();
    }
    isDraggable = false;
  };

  canvas.onmouseout = function(e) {
    isDraggable = false;
  };
}

const isPointInsideElement = (pointX, pointY, element) => {
  switch (element.type) {
    case "sticker":
      return (
          pointX >= element.x &&
          pointX <= element.x + element.image.width &&
          pointY >= element.y &&
          pointY <= element.y + element.image.height
      );
    case "text":
      return (
          pointX >= element.x &&
          pointX <= element.x + element.width &&
          pointY >= element.y &&
          pointY <= element.y + element.height
      );
  }
};

const readKeyboardInput = (event) => {
  if (selectedElement.value) {
    if (selectedElement.value.type == "text"){
      const keyPressed = event.key;
      // add backspace functionality
      switch (keyPressed) {
        case "Backspace":
          selectedElement.value.text = selectedElement.value.text.slice(0,-1);
          redrawCanvas();
          break;
        case "Tab":
          selectedElement.value.text += "   ";
          redrawCanvas();
          break;
        default:
          if (keyPressed.length == 1) {
            selectedElement.value.text += keyPressed;
            redrawCanvas();
          }
          break;
      }
    }
  }
};

//required for persistence
onMounted(() => {
  window.addEventListener('updateDisplay', updateDisplayEventListener);
  window.addEventListener('keydown', readKeyboardInput);
  if (imageAvailable.value) {
    redrawCanvas();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('updateDisplay', updateDisplayEventListener);
  window.removeEventListener('keydown', readKeyboardInput);
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
  max-height: 800px;
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