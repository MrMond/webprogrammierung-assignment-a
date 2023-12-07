<script>
import {tr} from "vuetify/locale";

export default {
  data() {
    return {
      image: null,
      selectionDialog: false,
      options: ["public/adorable_cat.jpg", "public/cat_in_a_box.jpg","public/cute_kitten.jpg","public/fluffy_kitty.jpg","public/sleeping_cat.jpg"],
    };
  },
  mounted() {
    // Lade das Bild aus dem Local Storage
    this.image = localStorage.getItem('uploadedImage');
  },

  methods: {
    handleDrop(event) {
      event.preventDefault();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const image = files[0];
        if (this.isTypeAllowed(image.type)) {
          this.handleImage(image);
        } else {
          console.log("recieved unsupported file")
          alert("Unsupported file type")
        }
      }
    },

    handleImage(image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;
        localStorage.setItem('uploadedImage', this.image);
        window.dispatchEvent(new Event('updateDisplay')); //send update to ImageManipulation.vue
      };
      reader.readAsDataURL(image);
    },

    isTypeAllowed(fileType) {
      const allowedTypes = ["image/jpeg", "image/png", "image/avif"];
      return allowedTypes.includes(fileType);
    },

    // Dialog
    openDialog() {
      this.selectionDialog = true;
    },

    closeDialog(){
      this.selectionDialog = false;
    },

    selectOption(selection) {
      this.image = selection
      localStorage.setItem('uploadedImage', this.image);
      window.dispatchEvent(new Event('updateDisplay')); //send update to ImageManipulation.vue
      this.closeDialog();
    },


  },
};
</script>

<template>
  <v-container
      class="image-uploader" 
      @dragover.prevent
      @drop="handleDrop">

    <v-btn v-if="!image" @click="openDialog">Drag and Drop Image or click to select a cat from our selection</v-btn>

    <v-dialog v-model="selectionDialog" max-width="400">
      <v-card>
        <v-card-title>Select a cat</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(option, index) in options" :key="index">
              <v-list-item-content @click="selectOption(option)">
                <v-img :src="option" height="200%" width="100px"></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn v-if="image" @click="openDialog">Drag and Drop a replacement Image or click to select a cat from our selection</v-btn>

    <v-dialog v-model="selectionDialog" max-width="400">
      <v-card>
        <v-card-title>Select a cat</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(option, index) in options" :key="index">
              <v-list-item-content @click="selectOption(option)">
                <v-img :src="option" height="200%" width="100px"></v-img>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
.image-uploader {
  border: 2px dashed rgba(255, 255, 255, 0.85);
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
  max-width: 80vw;
}

.image-uploader button {
  border: none;
  background: none;
  box-shadow: none;
}
</style>
