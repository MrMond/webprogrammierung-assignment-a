<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import ImageManipulation from "@/components/ImageManipulation.vue";
</script>

<template>
  <v-container class="generator">
    <h1 class="header-title" style="font-family: 'Times New Roman'; color: black;">Meow Generator</h1>
    <ImageManipulation />
    <ImageUploader/>
  </v-container>
</template>

<style scoped>
.generator {
  vertical-align: top !important;
  background-color: #f0f0f0;
  padding-bottom: 250px;
  padding-top: 250px;
  padding-right: 200px;
  padding-left: 200px;
}
</style>