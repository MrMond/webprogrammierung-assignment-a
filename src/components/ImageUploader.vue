<script>
export default {
  data() {
    return {
      image: null,
    };
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const image = files[0];
        this.handleImage(image);
      }
    },

    handleImage(image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;
      };
      reader.readAsDataURL(image);

      console.log("received a picture");
    },
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
    <img v-if="image" :src="image" alt="Uploaded Image" />
  </div>
  <span v-if="image">Drag and Drop another Image over the one you're working on, in order to replace it</span>
</template>

<style scoped>
.image-uploader {
  border: 2px dashed #ffffff;
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
}

.image-uploader img {
  max-width: 100%;
  max-height: 2000px; /* You can adjust the max-height as needed */
}
</style>
