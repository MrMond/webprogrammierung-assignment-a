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
      console.log("recieved a picture")
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
  border: 2px dashed #2d0e0e;
  padding: 20px;
  text-align: center;
}
</style>