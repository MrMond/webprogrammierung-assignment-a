<!-- Gallery.vue -->
<template>
  <v-container>
    <h1>Meowsterpeace Gallery</h1>
    <v-row>
      <v-col v-for="(card, index) in galleryData" :key="index" cols="auto">
        <div class="gallery-card-container" @click="showModal(index)">
          <PostCard :title="card.title" :imgSrc="card.imgSrc"/>
        </div>
      </v-col>
    </v-row>

    <!-- Modal for enlarged view -->
    <v-dialog v-model="showModalDialog" max-width="800">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on"></div>
      </template>
      <v-card>
        <v-card-text>
          <PostCard :title="selectedPostCard.title" :imgSrc="selectedPostCard.imgSrc" :largeView="true"/>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import PostCard from "@/components/PostCard.vue";
import { ref } from "vue";

const showModalDialog = ref(false);
const selectedPostCard = ref(null);

const galleryData = ref([
  { title: "Cat in a Box", imgSrc: "/cat_in_a_box.jpg" },
  { title: "Fluffy Kitty", imgSrc: "/fluffy_kitty.jpg" },
  { title: "Cute Kitten", imgSrc: "/cute_kitten.jpg" },
  { title: "Sleeping Cat", imgSrc: "/sleeping_cat.jpg" },
  { title: "Adorable Cat", imgSrc: "/adorable_cat.jpg" },
]);

const showModal = (index) => {
  selectedPostCard.value = { ...galleryData.value[index] };
  showModalDialog.value = true;
};

const closeModal = () => {
  showModalDialog.value = false;
};
</script>

<style scoped>
.gallery-card-container {
  cursor: pointer;
  width: 250px;
  height: 200px;
  overflow: hidden;
  margin: 8px;
}

.gallery-card-container .v-card {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-card-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
