<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
  <div class="container-generator">
    <h1 class="header-title">Meow Generator</h1>
    <ImageManipulation />
    <ImageUploader />
    
  </div>
</template>

<style scoped>
.container-generator {
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  padding-left: 2vw;
  padding-right: 2vw;
}

.header-title {
  font-family: 'Times New Roman';
  color: black;
  margin-top: 20px;
}

.füller {
  flex: 1;
  background-color: black;
  height: 1px;
}
</style>
