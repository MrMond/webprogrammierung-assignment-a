<script>// setup>
export default {
  methods:{
    handleDrop(event){
      event.preventDefault();

      const files = event.dataTransfer.files;
      if(files.length > 0){
        const image = files[0];
        this.handleImage(image)
      }
    },

    handleImage(image){
      //do something with the image
      console.log("received a picture")
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
    Drag and Drop Image here
  </div>
</template>

<style scoped>
.image-uploader{
  border: 2px dashed #ffffff;
  padding: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>