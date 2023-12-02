<script>
export default {
  data() {
    return {
      image: null,
    };
  },
  mounted() {
    // Retrieve image from sessionStorage when the component is mounted
    this.image = sessionStorage.getItem('uploadedImage');
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

        // Store the image data in sessionStorage
        sessionStorage.setItem('uploadedImage', this.image);
        window.dispatchEvent(new Event('updateDisplay')); //send update to ImageManipulation.vue
      };
      reader.readAsDataURL(image);
    },

    isTypeAllowed(fileType) {
      const allowedTypes = ["image/jpeg", "image/png", "image/avif"];
      return allowedTypes.includes(fileType);
    }
  },
};
</script>

<template>
  <div
      class="image-uploader"
      @dragover.prevent
      @drop="handleDrop"
  >
    <span v-if="!image">Drag and Drop Image here</span>
    <span v-if="image">Drag and Drop another Image in order to replace the picture currently on display</span>
  </div>
</template>

<style scoped>
.image-uploader {
  border: 2px dashed #ffffff;
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
