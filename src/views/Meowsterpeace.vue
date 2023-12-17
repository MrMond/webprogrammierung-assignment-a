<template>
  <v-container>
    <h1>Meowsterpeace Gallery</h1>

    <!-- Abänderung des Templates, dass jedes Meme in einem Container dargestellt wird, der auf Klick reagiert und die "showModal" Methode ausführt-->
    <v-row>
      <v-col v-for="(card, index) in sortedGalleryData" :key="index" cols="auto">
        <div class="gallery-card-container" @click="showModal(card)">
          <PostCard :title="card.title" :imgSrc="card.imgSrc" :likes="card.likes" @update-likes="updateLikes(card, $event)" />
        </div>
      </v-col>
    </v-row>


    <!-- Darstellung der detaillierten Ansicht der Memes. Unter Meme in großer Ansicht (in PostCard.vue definiert) Darstellung von Close und Remove Buttons -->
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
          <v-btn class="cardInteractable" @click="closeModal">Close</v-btn>
          <v-btn class="cardInteractable" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Bestätigungsdialog für das Löschen -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete your meowsterpeace?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="cancelDelete">Cancel</v-btn>
          <v-btn @click="removePostcard" color="red">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>



<script setup>
/* imports und refs*/
import PostCard from "@/components/PostCard.vue";
import { ref, computed,} from "vue";

const showModalDialog = ref(false);
const showAddPostcardDialog = ref(false);
const selectedPostCard = ref(null);
const newPostcard = ref({ title: '', imgSrc: '' });
const galleryData = ref(loadGalleryData());


/*Methode zum Öffnen der detaillierten Ansicht*/
const showModal = (card) => {
  selectedPostCard.value = { ...card };
  showModalDialog.value = true;
};

/* Methode zum Schließen der detaillierten Ansicht*/
const closeModal = () => {
  showModalDialog.value = false;
};

/* Methode zur Aktualisierung der Likes eines Memes sowohl lokal, als auch im localstorage*/
const updateLikes = (card, newLikes) => {
  card.likes = newLikes;

  // Update galleryData
  const index = galleryData.value.findIndex(item => item.title === card.title);
  if (index !== -1) {
    galleryData.value[index].likes = newLikes;

    // Update local storage
    localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));
  }
};






/*methode zum sortieren der Memes absteigend nach Likezahl, Update der reihenfolge bei jeder Änderung der galleryData arrays*/
const sortedGalleryData = computed(() => {
  return [...galleryData.value].sort((a, b) => b.likes - a.likes);
});

/*Methode zum Laden des gallery_data Arrays aus dem localstorage. Die fünf dummys dienen als Standard, falls leer*/
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



/*Methode zum hinzufügen eines Memes in der Gallery*/
const openPostcardDetails = (event) => {
  // Öffnen das Dialogfensters für die Eingabe
  const { title, imgSrc } = event.detail;
  if (title && imgSrc) {
    selectedPostCard.value = { title, imgSrc, likes: 0 };
    showModalDialog.value = true;
    // Fügt das neue Meme zum galleryData Array hinzu
    galleryData.value.push({ title, imgSrc, likes: 0 });
    // Update local storage
    localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));
  }
};

/* Eventlistener zum Auslösen der openpostcarddetails methode*/
window.addEventListener('openPostcardDetails', openPostcardDetails);


const showDeleteDialog = ref(false);

const confirmDelete = () => {
  showDeleteDialog.value = true;
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
};

const removePostcard = () => {
  showDeleteDialog.value = false;
  if (selectedPostCard.value) {
    const index = galleryData.value.findIndex(item => item.title === selectedPostCard.value.title);
    if (index !== -1) {
      // Entfernen aus galleryData
      galleryData.value.splice(index, 1);
      // Update local storage
      localStorage.setItem('gallery_data', JSON.stringify(galleryData.value));
      showModalDialog.value = false;
    }
  }
};
</script>




<!-- Manuelle Syle Anpassungen für diese Seite-->
<style scoped>
h1 {
  font-family: 'Times New Roman', Times, serif;
  color: white;
}

.gallery-card-container {
  cursor: pointer;
  width: 250px;
  height: 200px;
  overflow: hidden;
  margin: 8px;
}

.cardInteractable {
  font-family: 'Arial', 'serif';
}
</style>