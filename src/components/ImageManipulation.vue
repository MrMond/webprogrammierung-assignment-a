<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { uploadPostCard } from '../components/db';
import { getDBImage, setDBImage } from "../components/localDB"
export default {
  setup() {
    //sticker selection
    const stickerDialog = ref(false);
    const stickers = ref(['Angry', 'Big Angry', 'Circle S', 'Circle M', 'Circle L', 'Speed L', 'Speed R'])
    const selectedSticker = ref({ sticker: "public/user1-128x128.jpg", scale: 0 })
    //setup of image
    const image = ref(null);
    const imageAvailable = ref(!!image.value);
    // drawing variables
    const cursorX = ref(0);
    const cursorY = ref(0);
    const selectedElement = ref(null);
    const allElements = ref([]);
    const scaleFactorX = ref(1);
    const scaleFactorY = ref(1);

    const debug = true;

    const updateImage = () => {
      getDBImage().then((imageData) => { //read data from session storage
        image.value = imageData; //imageData
        imageAvailable.value = !!image.value;
        redrawCanvas(); //update shown image
        console.log("updated image");
      }).catch(error => {
        console.error('Error getting image:', error);
      });

    };

    const updateDisplayEventListener = (event) => {
      const imgSrc = event.detail.imgSrc;
      console.log(`recieved image, not null? ${!!imgSrc}`);
      selectedElement.value = null;
      allElements.value = []; // clear user elements (stickers/text)
      setDBImage(imgSrc).then(() => { //update session storage
        updateImage();
      });
    };

    //button listeners
    const buttonText = () => {
      if (!!image.value) {
        createTextElement("click to edit");
      }
    };

    const buttonSave = () => {
      if (!!image.value) {
        try {
          console.log(`Number of saved Elements: ${allElements.value.length}`);
          const canvas = document.getElementById("canvas");
          const combinedImage = new Image();
          combinedImage.src = canvas.toDataURL(); //combine all movable elements to a single image
          console.log(combinedImage.src)
          combinedImage.onload = () => {
            try {
              setDBImage(combinedImage.src).then(() => { //update session storage
                allElements.value = [];
                selectedElement.value = null; //clear all active elements
                const title = prompt("Enter the title for the new postcard:");
                if (title) {
                  uploadPostCard(title, combinedImage.src, 0).then(() => { //save to firebase
                  });
                }
                window.dispatchEvent(new CustomEvent('updateDisplay', { detail: { imgSrc: combinedImage.src } })); //call updateImage with new image
                alert("Saved your changes. The image will be available in the gallery shortly.");
              });
            } catch (e) {
              console.log("Saving failed", e);
              alert("Your browser's cache overflowed. Try again with a smaller image.");
            }
          };
        } catch (e) {
          console.log("Saving failed", e);
          alert("Your browser's cache overflowed. Try again with a smaller image.");
        }
      }
    };

    const openDialog = () => {
      stickerDialog.value = true;
    };

    const closeDialog = () => {
      stickerDialog.value = false;
    };

    const selectSticker = (selection) => { //sticker selection from dialog box
      if (!!image.value) {
        let img_scale;
        const canvas = document.getElementById("canvas"); // decide on scale factor, to combat too small elements
        if (canvas.width < canvas.height) {
          img_scale = scaleFactorY.value;
        } else {
          img_scale = scaleFactorX.value;
        }
        switch (selection) {
          case "Angry":
            selectedSticker.value = { sticker: "public/angry.png", scale: 0.1 * img_scale };
            break;
          case "Big Angry":
            selectedSticker.value = { sticker: "public/angry.png", scale: 0.15 * img_scale };
            break;
          case "Circle S":
            selectedSticker.value = { sticker: "public/circle.png", scale: 0.05 * img_scale };
            break;
          case "Circle M":
            selectedSticker.value = { sticker: "public/circle.png", scale: 0.1 * img_scale };
            break;
          case "Circle L":
            selectedSticker.value = { sticker: "public/circle.png", scale: 0.15 * img_scale };
            break;
          case "Speed L":
            selectedSticker.value = { sticker: "public/speed_left.png", scale: 0.15 * img_scale };
            break;
          case "Speed R":
            selectedSticker.value = { sticker: "public/speed_right.png", scale: 0.15 * img_scale };
            break;
          default:
            selectedSticker.value = { sticker: "public/user1-128x128.jpg", scale: 0.99 * img_scale };
            break;
        }
        closeDialog();
        createStickerElement();
      }
    }

    //button functionality
    const createTextElement = (text) => {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const textarea = { type: "text", text: text, size: 50, x: 10, y: 10, width: 0, height: 0 };
      allElements.value.push(textarea);
      drawTextarea(ctx, textarea); //make interactable textarea appear
      makeMovable(canvas);
    };

    const createStickerElement = () => {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = selectedSticker.value.sticker;
      img.onload = () => {
        const sticker = { type: "sticker", image: img, x: 10, y: 10, scale: selectedSticker.value.scale };
        allElements.value.push(sticker);
        drawSticker(ctx, sticker); //make interactable sticker appear
        makeMovable(canvas);
      };
    }

    const drawSticker = (context, sticker) => {
      const width = sticker.image.width * sticker.scale;
      const height = sticker.image.height * sticker.scale;
      context.drawImage(sticker.image, sticker.x, sticker.y, width, height);
      console.log("Sticker draw call");
    };

    const drawTextarea = (context, textarea) => {
      const textSize = textarea.size;
      context.font = `${textSize}px Lobster`;
      context.fillStyle = 'white';
      context.strokeStyle = 'black';
      context.lineWidth = textSize / 15;
      context.fillText(textarea.text, textarea.x, textarea.y + textSize);
      context.strokeText(textarea.text, textarea.x, textarea.y + textSize);
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
      img.onload = () => { //resize canvas
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); //draw user provided image
        allElements.value.forEach(element => {
          switch (element.type) {
            case "sticker":
              drawSticker(ctx, element); //draw all stickers
              break;
            case "text":
              drawTextarea(ctx, element) //draw all text elements
              break;
          }
        });
      }
      console.log("redrew canvas");
    };

    const makeMovable = (canvas) => { //handle movable entities
      const rect = canvas.getBoundingClientRect();
      scaleFactorX.value = canvas.width / rect.width;
      scaleFactorY.value = canvas.height / rect.height;
      var isDraggable = false;

      canvas.onmousedown = function (event) { //click down --> select element
        cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
        cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
        if(debug){
          const ctx = canvas.getContext("2d");
          ctx.fillRect(cursorX.value-15, cursorY.value-15, 30, 30);
        }
        try {
          console.log(`click (${cursorX.value}/${cursorY.value}) text (${selectedElement.value.x}/${selectedElement.value.y}/w:${selectedElement.value.width}/h:${selectedElement.value.height})`);
        } catch { }
        allElements.value.forEach(element => {
          if (isPointInsideElement(cursorX.value, cursorY.value, element)) {
            selectedElement.value = element;
            console.log("selected Element")
            isDraggable = true;
          }
        });
      };

      /*canvas.onmousemove = function (event) { //update position
        if (isDraggable) {
          cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
          cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
          selectedElement.value.x = cursorX.value
          selectedElement.value.y = cursorY.value
        }
      };*/

      canvas.onmouseup = function (event) { //let go --> reposition element
        cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
        cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
        if(debug){
          const ctx = canvas.getContext("2d");
          ctx.fillRect(cursorX.value - 15, cursorY.value -15, 30, 30);
        }
        console.log(`mouseup @ (${cursorX.value}/${cursorY.value})`)
        if (isDraggable) {
          switch (selectedElement.value.type) {
            case "sticker":
              selectedElement.value.x = cursorX.value - selectedElement.value.scale * selectedElement.value.image.width / 2;
              selectedElement.value.y = cursorY.value - selectedElement.value.scale * selectedElement.value.image.height / 2;
              break;
            case "text":
              selectedElement.value.x = cursorX.value - selectedElement.value.width / 2;
              selectedElement.value.y = cursorY.value - selectedElement.value.height / 2;
              break;
            default:
              selectedElement.value.x = cursorX.value;
              selectedElement.value.y = cursorY.value;
              break;
          }
        }
        redrawCanvas();
        isDraggable = false;
      };

      canvas.onmouseout = function (e) {
        isDraggable = false;
      };
    }

    const isPointInsideElement = (pointX, pointY, element) => { // position check
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      switch (element.type) {
        case "sticker":
          ctx.fillRect(element.x, element.y, 10, 10);
          ctx.fillRect(element.x, element.y + element.scale * element.image.height, 10, 10);
          ctx.fillRect(element.x + element.scale * element.image.width, element.y, 10, 10);
          ctx.fillRect(element.x + element.scale * element.image.width, element.y + element.scale * element.image.height, 10, 10);
          return (
            pointX >= element.x &&
            pointX <= element.x + element.scale * element.image.width &&
            pointY >= element.y &&
            pointY <= element.y + element.scale * element.image.height
          );
        case "text":
          ctx.fillRect(element.x, element.y, 10, 10);
          ctx.fillRect(element.x, element.y + element.height, 10, 10);
          ctx.fillRect(element.x + element.width, element.y, 10, 10);
          ctx.fillRect(element.x + element.width, element.y + element.height, 10, 10);
          return (
            pointX >= element.x &&
            pointX <= element.x + element.width &&
            pointY >= element.y &&
            pointY <= element.y + element.height
          );
      }
    };

    const readKeyboardInput = (event) => { //handle keyboard interactions
      if (selectedElement.value) {
        if (selectedElement.value.type == "text") {
          const keyPressed = event.key;
          switch (keyPressed) {
            case "Backspace":
              selectedElement.value.text = selectedElement.value.text.slice(0, -1);
              redrawCanvas();
              break;
            case "Tab":
              selectedElement.value.text += "   ";
              redrawCanvas();
              break;
            case "PageUp":
              selectedElement.value.size += 5;
              redrawCanvas();
              break;
            case "PageDown":
              selectedElement.value.size = Math.max(5, selectedElement.value.size - 5);
              redrawCanvas();
              break;
            default:
              if (keyPressed.length == 1) {
                selectedElement.value.text += keyPressed;
                redrawCanvas();
              } else { console.log(keyPressed) }
              break;
          }
        }
      }
    };

    //required for persistence
    onMounted(() => {
      window.addEventListener('updateDisplay', updateDisplayEventListener);
      window.addEventListener('keydown', readKeyboardInput);
      updateImage();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('updateDisplay', updateDisplayEventListener);
      window.removeEventListener('keydown', readKeyboardInput);
    });
    return {
      imageAvailable,
      buttonText,
      buttonSave,
      stickerDialog,
      stickers,
      openDialog,
      closeDialog,
      selectSticker,
    }
  }
};
</script>

<template>
  <v-container v-if="imageAvailable" class="button-container">
    <v-btn @click="buttonText"> Text </v-btn>
    <v-btn @click="openDialog">Stickers</v-btn>

    <v-dialog v-model="stickerDialog" max-width="400">
      <v-card>
        <v-card-title>Select Sticker</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(sticker, index) in stickers" :key="index">
              <v-list-item-content @click="selectSticker(sticker)">
                {{ sticker }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn @click="buttonSave" style="background-color: #63775B; color: white"> Save </v-btn>
  </v-container>
  <v-container class="image-manipulation">
    <canvas id="canvas" width="0" height="0"></canvas>
  </v-container>
</template>

<style scoped>
.image-manipulation {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 70vw;
  /* Maximale Breite des Containers auf 70% der Bildschirmbreite begrenzen */
  max-height: 70vh;
  /* Maximale Höhe des Containers auf 70% der Bildschirmhöhe begrenzen */

}

.image-manipulation canvas {
  object-fit: contain;
  /* Oder "cover", je nachdem, welches Verhalten Sie bevorzugen */
  max-width: 1050px;
  /* Maximale Breite des Bildes auf 1050 Pixel begrenzen */
  max-height: 100%;
  /* Maximale Höhe des Bildes auf 100% des Containers festlegen */
  /*width: 100%;
   Breite auf 100% des Containers festlegen */
  /*height: 100%;
   Höhe auf 100% des Containers festlegen */
}



.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.button-container button {
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.55);
  font-family: 'Arial', 'serif';
}</style>