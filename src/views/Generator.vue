
<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
//export default{
//  components:{
//    ImageUploader,
//  },
//  methods:{
//    handleDisplayImage(image){
//      //handle it
//    },
//  },
//};
</script>

<template>
  <h1>Martin du schaffst das</h1>
  <div>
    <image-uploader @display-image="handleDisplayImage"/>
  </div>
</template>
