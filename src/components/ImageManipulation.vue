<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
export default {
  setup() {
    //sticker selection
    const stickerDialog = ref(false);
    const stickers = ref(['Angry', 'Big Angry', 'Circle S', 'Circle M', 'Circle L', 'Speed L', 'Speed R'])
    const selectedSticker = ref({sticker:"public/user1-128x128.jpg",scale:0})
    //setup of image
    const image = ref(localStorage.getItem('uploadedImage'));
    const imageAvailable = ref(!!image.value);
    // drawing variables
    const cursorX = ref(0);
    const cursorY = ref(0);
    const selectedElement = ref(null);
    const allElements = ref([]);
    const scaleFactorX = ref(1);
    const scaleFactorY = ref(1);
    const updateImage = () => {
      image.value = localStorage.getItem('uploadedImage');
      imageAvailable.value = !!image.value;
      redrawCanvas();
      console.log("updated image");
    };

    const updateDisplayEventListener = () => {
      console.log("received picture");
      selectedElement.value = null;
      allElements.value = [];
      updateImage();
    };

    //button listeners
    const buttonText = () => {
      if(!!image.value) {
        createTextElement("click to edit");
      }
    };

    const buttonSave = () => {
      if (!!image.value) {
        //redrawCanvas();
        try {
          console.log(`Number of saved Elements: ${allElements.value.length}`);
          const canvas = document.getElementById("canvas");
          const combinedImage = new Image();
          combinedImage.src = canvas.toDataURL();
          combinedImage.onload = () => {
            try {
              localStorage.setItem('uploadedImage', null);
              localStorage.setItem('uploadedImage', combinedImage.src);
              allElements.value = [];
              selectedElement.value = null;
            } catch (e) {
              console.log("Saving failed, cache full");
              alert("Your browser's cache overflowed. Try again with a smaller image.");
            }
            window.dispatchEvent(new Event('updateDisplay'));
            window.dispatchEvent(new Event('saveImage'));
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

    const openDialog = () => {
      stickerDialog.value = true;
    };

    const closeDialog = () => {
      stickerDialog.value = false;
    };

    const selectSticker = (selection) =>  {
      if(!!image.value) {
        let img_scale;
        const canvas = document.getElementById("canvas");
        if (canvas.width < canvas.height) {
          img_scale = scaleFactorY.value;
        } else {
          img_scale = scaleFactorX.value;
        }
        switch (selection) {
          case "Angry":
            selectedSticker.value = {sticker:"public/angry.png",scale:0.1*img_scale};
            break;
          case "Big Angry":
            selectedSticker.value = {sticker:"public/angry.png",scale:0.15*img_scale};
            break;
          case "Circle S":
            selectedSticker.value = {sticker:"public/circle.png",scale:0.05*img_scale};
            break;
          case "Circle M":
            selectedSticker.value = {sticker:"public/circle.png",scale:0.1*img_scale};
            break;
          case "Circle L":
            selectedSticker.value = {sticker:"public/circle.png",scale:0.15*img_scale};
            break;
          case "Speed L":
            selectedSticker.value = {sticker:"public/speed_left.png",scale:0.15*img_scale};
            break;
          case "Speed R":
            selectedSticker.value = {sticker:"public/speed_right.png",scale:0.15*img_scale};
            break;
          default:
            selectedSticker.value = {sticker:"public/user1-128x128.jpg",scale:0.99*img_scale};
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
      //const text = "click to edit";
      const textarea = {type:"text",text:text,size:50,x:10,y:10,width:0,height:0};
      allElements.value.push(textarea);
      drawTextarea(ctx, textarea);
      makeMovable(canvas);
    };

    const createStickerElement = () => {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = selectedSticker.value.sticker;
      img.onload = () => {
        const sticker = {type:"sticker",image:img,x:10,y:10,scale:selectedSticker.value.scale};
        allElements.value.push(sticker);
        drawSticker(ctx, sticker);
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
      scaleFactorX.value = canvas.width / rect.width;
      scaleFactorY.value = canvas.height / rect.height;
      var isDraggable = false;

      canvas.onmousedown = function(event) {
        cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
        cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
        try {
          console.log(`click (${cursorX.value}/${cursorY.value}) text (${selectedElement.value.x}/${selectedElement.value.y}/w:${selectedElement.value.width}/h:${selectedElement.value.height})`);
        } catch {}
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
          cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
          cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
          selectedElement.value.x = cursorX.value
          selectedElement.value.y = cursorY.value
        }
      };

      canvas.onmouseup = function(event) {
        cursorX.value = (event.clientX - rect.left) * scaleFactorX.value;
        cursorY.value = (event.clientY - rect.top) * scaleFactorY.value;
        console.log(`mouseup @ (${cursorX.value}/${cursorY.value})`)
        if (isDraggable) {
          switch (selectedElement.value.type){
            case "sticker":
              selectedElement.value.x = cursorX.value - selectedElement.value.scale * selectedElement.value.image.width/2;
              selectedElement.value.y = cursorY.value - selectedElement.value.scale * selectedElement.value.image.height/2;
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
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      switch (element.type) {
        case "sticker":
          ctx.fillRect(element.x,element.y,10,10);
          ctx.fillRect(element.x,element.y + element.scale * element.image.height,10,10);
          ctx.fillRect(element.x + element.scale * element.image.width,element.y,10,10);
          ctx.fillRect(element.x + element.scale * element.image.width,element.y + element.scale * element.image.height,10,10);
          return (
              pointX >= element.x &&
              pointX <= element.x + element.scale * element.image.width &&
              pointY >= element.y &&
              pointY <= element.y + element.scale * element.image.height
          );
        case "text":
          ctx.fillRect(element.x,element.y,10,10);
          ctx.fillRect(element.x,element.y + element.height,10,10);
          ctx.fillRect(element.x + element.width,element.y,10,10);
          ctx.fillRect(element.x + element.width,element.y + element.height,10,10);
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
            case "PageUp":
              selectedElement.value.size += 5;
              redrawCanvas();
              break;
            case "PageDown":
              selectedElement.value.size = Math.max(5, selectedElement.value.size-5);
              redrawCanvas();
              break;
            default:
              if (keyPressed.length == 1) {
                selectedElement.value.text += keyPressed;
                redrawCanvas();
              } else {console.log(keyPressed)}
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
        updateImage();
      }
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
  <v-container v-if = "imageAvailable" class="button-container">
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
  <v-container class = "image-manipulation">
    <canvas id="canvas" width="0" height="0"></canvas>
  </v-container>
</template>

<style scoped>
.image-manipulation canvas {
  max-width: 45vw;
  max-height: 65vh;
  background-color: rgba(255, 255, 255, 0.25);
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.button-container button {
  margin-left: 10px;
  background-color: rgba(255, 255, 255, 0.55);
}
</style>