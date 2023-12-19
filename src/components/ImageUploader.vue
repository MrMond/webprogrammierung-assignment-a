<script>
export default {
  data() {
    return {
      image: null,
      selectionDialog: false,
      options: ["public/adorable_cat.jpg", "public/cat_in_a_box.jpg", "public/cute_kitten.jpg", "public/fluffy_kitty.jpg", "public/sleeping_cat.jpg"], //dialog box options
    };
  },

  methods: {
    handleDrop(event) { //drag and drop of files
      event.preventDefault();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const image = files[0];
        if (this.isTypeAllowed(image.type)) { //type filter for common picture formats
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
        this.image = reader.result; //image comes from user
        window.dispatchEvent(new CustomEvent('updateDisplay',{ detail: { imgSrc: this.image } })); //image sent to other parts of code
      };
      reader.readAsDataURL(image);
    },

    isTypeAllowed(fileType) {
      const allowedTypes = ["image/jpeg", "image/png", "image/avif"];
      return allowedTypes.includes(fileType);
    },

    // Dialog box for provided images
    openDialog() {
      this.selectionDialog = true;
    },

    closeDialog() {
      this.selectionDialog = false;
    },

    selectOption(selection) {
      this.image = selection //image selection comes from provided images
      window.dispatchEvent(new CustomEvent('updateDisplay',{ detail: { imgSrc: this.image } })); //sent for further use
      this.closeDialog();
    },

  },
};
</script>

<template>
  <div class="image-uploader" @dragover.prevent @drop="handleDrop">

    <btn v-if="!image" @click="openDialog" >Drag and Drop Image or click to select a cat from our selection</btn>

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

    <btn v-if="image" @click="openDialog">Drag and Drop a replacement Image or click to select a cat from our
      selection</btn>

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

  </div>
</template>

<style scoped>
.image-uploader {
  border: 2px dashed rgba(255, 255, 255, 0.85);
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
  max-width: 80vw;
  margin-bottom: 20px;
}

.image-uploader button {
  border: none;
  background: none;
  box-shadow: none;
  font-family: 'Arial', 'serif';
}
</style>
