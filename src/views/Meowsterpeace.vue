<template>
  <!-- Hauptcontainer für die Meowsterpeace Gallery Seite -->
  <div class="container-gallery">
    <!-- Container für die Überschrift der Seite -->
    <div class="headline-container">
      <h1  >Meowsterpeace Gallery</h1>
    </div>
    <!-- Dynamische Anzeige der Meme-Karten basierend auf Vuetify Breakpoints -->
    <v-row>
      <!--Responsives Anzeigen der Karten für Breiten der Größe md als 4/12 der Gesamtbreite-->
      <v-col
        v-if="isMini === 'md'"
        v-for="(card, index) in sortedGalleryData"
        :key="index"
        cols="4"
        class="gallery-card-col"
      >
        <!-- Klickbarer Container für jedes Meme -->
        <div class="gallery-card-container" @click="showModal(card)">
          <!-- Verwendung der PostCard-Komponente für die Anzeige der Karte -->
          <PostCard
            :title="card.title"
            :imgSrc="card.imgSrc"
            :likes="card.likes"
            @update-likes="updateLikes(card, $event)"
          />
        </div>
      </v-col>

      <!-- Wiederholung des obigen Musters für die Bildschirmgrößen sm (6/12 breite Karten) und xs (vollständige breite Karten)  -->
      <v-col
        v-if="isMini === 'sm'"
        v-for="(card, index) in sortedGalleryData"
        :key="index"
        cols="6"
        class="gallery-card-col"
      >
        <div class="gallery-card-container" @click="showModal(card)">
          <PostCard
            :title="card.title"
            :imgSrc="card.imgSrc"
            :likes="card.likes"
            @update-likes="updateLikes(card, $event)"
          />
        </div>
      </v-col>

      
      <v-col
        v-if="isMini === 'xs'"
        v-for="(card, index) in sortedGalleryData"
        :key="index"
        cols="12"
        class="gallery-card-col"
      >
        <div class="gallery-card-container" @click="showModal(card)">
          <PostCard
            :title="card.title"
            :imgSrc="card.imgSrc"
            :likes="card.likes"
            @update-likes="updateLikes(card, $event)"
          />
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
          <PostCard :title="selectedPostCard.title" :imgSrc="selectedPostCard.imgSrc" :likes="selectedPostCard.likes"
            :largeView="true" @update-likes="updateLikes(selectedPostCard, $event)" />
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
  </div>
</template>



<script setup>
/* imports und refs*/
import PostCard from "@/components/PostCard.vue";
import { ref, computed, onBeforeUnmount, onMounted, reactive } from "vue";
import { getPostCards, deletePostCard, updatePostCard } from "../components/db"
import { connectStorageEmulator } from "firebase/storage";

const showModalDialog = ref(false);
const showAddPostcardDialog = ref(false);
const selectedPostCard = ref(null);
const newPostcard = ref({ title: '', imgSrc: '' });
const galleryData = ref([{ id: null, likes: 0, title: "", imgSrc: "" }]);


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
  }
};


/*methode zum sortieren der Memes absteigend nach Likezahl, Update der reihenfolge bei jeder Änderung der galleryData arrays*/
const sortedGalleryData = computed(() => {
  return [...galleryData.value].sort((a, b) => b.likes - a.likes);
});

/*Methode zum Laden der karten aus der firebase*/
async function loadGalleryData() {
  try {
    const data = await getPostCards();
    if (data && data.length > 0) {
      galleryData.value = reactive([...data]);
    } else {
      console.log("reverted to using default option");
      galleryData.value = reactive([{
        id: "yR7sLam2qKm0VBC1tg3p",
        likes: 0, title: "Grumpy Cat",
        imgSrc: "https://firebasestorage.googleapis.com/v0/b/webprogrammierung-asignment-a.appspot.com/o/images%2F1f66f300-ee55-4a9f-801d-abcfcd817551?alt=media&token=54a1e896-7c7f-4181-960a-c5bf99ac04c8"
      }]);
    }
  } catch (error) {
    console.warn("Loading gallery failed: ", error);
    galleryData.value = reactive([{
      id: "yR7sLam2qKm0VBC1tg3p",
      likes: 0, title: "Grumpy Cat",
      imgSrc: "https://firebasestorage.googleapis.com/v0/b/webprogrammierung-asignment-a.appspot.com/o/images%2F1f66f300-ee55-4a9f-801d-abcfcd817551?alt=media&token=54a1e896-7c7f-4181-960a-c5bf99ac04c8"
    }]);
  }

  }

/* Methode zum Anzeigen des Lösch-Bestätigungsdialogs */
const showDeleteDialog = ref(false);

  /* Methode zur Bestätigung des Löschens */
  const confirmDelete = () => {
    showDeleteDialog.value = true;
  };

  /* Methode zum Abbrechen des Löschvorgangs */
  const cancelDelete = () => {
    showDeleteDialog.value = false;
  };

  /* Methode zum Entfernen einer Postkarte */
  const removePostcard = () => {
    showDeleteDialog.value = false;
    if (selectedPostCard.value) {
      const index = galleryData.value.findIndex(item => item.title === selectedPostCard.value.title);
      if (index !== -1) {
        const id = selectedPostCard.value.id;
        // Entfernen aus galleryData
        galleryData.value.splice(index, 1);
        // Update firebase
        deletePostCard(id);
        showModalDialog.value = false;
      }
    }
  };

  /* Lifecycle-Hooks für das Mounten und Unmounten der Komponente */
  onMounted(async () => {
    await loadGalleryData();
    console.log(`downloaded ${galleryData.value.length} cards`);
    console.log(galleryData.value)
  });

  onBeforeUnmount(() => { //in der firebase alle karten updaten
    galleryData.value.forEach(element => {
      if (!!element.id && element.imgSrc != "public/error-image.jpg") {
        updatePostCard(element.title, element.imgSrc, element.likes, element.id);
        console.log(`updated Likes to ${element.likes} for ${element.title}`);
      }
    });
  });


import { useDisplay } from 'vuetify'
  
/* Verwendung von Vuetify useDisplay für das Reagieren auf Bildschirmgrößenänderungen */
const { name } = useDisplay()

const isMini = computed(() => {
  switch (name.value) {
    case 'xs': return "xs"
    case 'sm': return "sm"
    case 'md': return "md"
    case 'lg': return "md"
    case 'xl': return "md"
    case 'xxl': return "md"
  }
})
</script>



<style scoped>

/*Style für die Überschrift */
h1 {
  font-family: 'Times New Roman', Times, serif;
  color: white;
}

/*Style für Container, in denen die Memes dargestellt werden, die Container liegen in dem Grid system, was durch v-row und v-col entsteht */
.gallery-card-container {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 8px;
}

/*Style für Titel der Memes */
.gallery-card-container .title {
  flex: 1; 
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/*Style der Buttons */
.cardInteractable {
  font-family: 'Arial', 'serif';
}

/*Style für Container, in dem die Überschrift der seite liegt */
.headline-container{
 
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  margin-bottom: 30px;
  margin-top: 30px;

}

/*main Container der Seite */
.container-gallery {
  
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
</style>