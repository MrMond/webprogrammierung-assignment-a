<!-- Gallery.vue -->
<template>
  <v-container>
    <h1>Meowsterpeace Gallery</h1>

    <v-row>
      <v-col v-for="(card, index) in sortedGalleryData" :key="index" cols="auto">
        <div class="gallery-card-container" @click="showModal(card)">
          <PostCard :title="card.title" :imgSrc="card.imgSrc" :likes="card.likes" @update-likes="updateLikes(card, $event)" />
        </div>
      </v-col>
    </v-row>

    <v-btn @click="showAddPostcardDialog = true">Neue Postcard hinzufügen</v-btn>

    <!-- Modal for enlarged view -->
    <v-dialog v-model="showModalDialog" max-width="800">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on"></div>
      </template>
      <v-card>
        <v-card-text>
          <PostCard
              :title="selectedPostCard.title"
              :imgSrc="selectedPostCard.imgSrc"
              :likes="selectedPostCard.likes"
              :largeView="true"
              @update-likes="updateLikes(selectedPostCard, $event)"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeModal">Schließen</v-btn>
          <!-- Neuer Button zum Entfernen -->
          <v-btn @click="removePostcard">Entfernen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddPostcardDialog" max-width="400">
      <v-card>
        <v-card-title>Neue Postcard hinzufügen</v-card-title>
        <v-card-text>
          <v-text-field v-model="newPostcard.title" label="Titel" />
          <v-text-field v-model="newPostcard.imgSrc" label="Bild-URL" />
          <v-text-field v-model="newPostcard.likes" label="Likes" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="addNewPostcard">Hinzufügen</v-btn>
          <v-btn @click="cancelAddPostcard">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import PostCard from "@/components/PostCard.vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const showModalDialog = ref(false);
const showAddPostcardDialog = ref(false);
const selectedPostCard = ref(null);
const newPostcard = ref({ title: '', imgSrc: '' });

const galleryData = ref(loadGalleryData());

const showModal = (card) => {
  selectedPostCard.value = { ...card };
  showModalDialog.value = true;
};

const closeModal = () => {
  showModalDialog.value = false;
};

const updateLikes = (card, newLikes) => {
  card.likes = newLikes;

  // Update the likes in galleryData
  const index = galleryData.value.findIndex(item => item.title === card.title);
  if (index !== -1) {
    galleryData.value[index].likes = newLikes;

    // Update local storage
    localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));
  }
};


const addNewPostcard = () => {
  const { title } = newPostcard.value;

  if (title) {
    // Die imgSrc auf das zuletzt gespeicherte Bild setzen
    const imgSrc = sessionStorage.getItem('uploadedImage') || "/default_image.jpg";
    const newPost = { title, imgSrc, likes: 0 };

    galleryData.value.push(newPost);

    // Update local storage
    localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));

    // Reset form und schließe den Dialog
    newPostcard.value = { title: '', imgSrc: '' };
    showAddPostcardDialog.value = false;
  }
};


const cancelAddPostcard = () => {
  newPostcard.value = { title: '', imgSrc: '' };
  showAddPostcardDialog.value = false;
};

const removePostcard = () => {
  if (selectedPostCard.value) {
    // Find the index of the selected postcard
    const index = galleryData.value.findIndex(item => item.title === selectedPostCard.value.title);

    if (index !== -1) {
      // Remove the postcard from galleryData
      galleryData.value.splice(index, 1);

      // Update local storage
      localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));

      // Close the modal
      showModalDialog.value = false;
    }
  }
};

const sortedGalleryData = computed(() => {
  return [...galleryData.value].sort((a, b) => b.likes - a.likes);
});

function loadGalleryData() {
  const data = localStorage.getItem('gallery_data');
  return data ? JSON.parse(data) : [
    { title: "Cat in a Box", imgSrc: "/cat_in_a_box.jpg", likes: 17 },
    { title: "Fluffy Kitty", imgSrc: "/fluffy_kitty.jpg", likes: 5 },
    { title: "Cute Kitten", imgSrc: "/cute_kitten.jpg", likes: 0 },
    { title: "Sleeping Cat", imgSrc: "/sleeping_cat.jpg", likes: 13 },
    { title: "Adorable Cat", imgSrc: "/adorable_cat.jpg", likes: 11 },
  ];
}

onBeforeUnmount(() => {
  // Cleanup if needed
});

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
