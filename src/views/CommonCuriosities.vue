<template>
  <!-- Hauptcontainer der FAQ-Seite -->
  <div class="faq-main-container">
    <div>
      <!-- Überschrift -->
      <h2 class="faq-heading">Common Curiosities</h2>
    </div>

    <!-- Vuetify Expansion Panels für die FAQ-Liste, Inhalt der Panels kommen von Firebase-->
    <v-expansion-panels v-for="(faq,index) in faqs" :key="index" cols="auto">
      <v-expansion-panel :title="faq.question"
        :text="faq.answer"
        class="mb-5">
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Button zum Öffnen des Dialogs für weitere Fragen -->
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn class="button" @click="openNewQuestionDialog" color="#63775B" dark>Still curious?</v-btn>
      </v-col>
    </v-row>

    <!-- Dialog für weitere Fragen -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Ask us</v-card-title>
        <v-card-text>
          <p>If you have a question that has not yet been answered here, please contact us at:</p>
          <p><strong>{{ email }}</strong></p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeNewQuestionDialog" color="primary">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>

import { reactive, ref, onMounted } from 'vue';
import { getFAQTuples } from "../components/db";


const faqs = ref([
  { question: '', answer: '' },
]);

const openPanels = ref([]);
const dialog = ref(false);
const email = "questions@meow.meme";

// Funktion zum Öffnen/Schließen der Panels
const togglePanel = (index) => {
  const isOpen = openPanels.value.includes(index);
  if (isOpen) {
    openPanels.value = openPanels.value.filter((item) => item !== index);
  } else {
    openPanels.value = [...openPanels.value, index];
  }
};

// Funktion zum Öffnen des Dialogs für neue Fragen
const openNewQuestionDialog = () => {
  dialog.value = true;
};

// Funktion zum Schließen des Dialogs für neue Fragen
const closeNewQuestionDialog = () => {
  dialog.value = false;
};

// Funktion zum Laden der FAQ-Daten beim Laden der Komponente
async function loadFAQ() {
  try {
    const data = await getFAQTuples();
    if (data && data.length > 0) {
      faqs.value = reactive([...data]);
    }
  } catch {}
  console.log(faqs)
}

// Aufruf der loadFAQ-Funktion beim Mounten der Komponente
onMounted(async () => {
  await loadFAQ();
});
</script>

<style scoped>

/*Style für die Überschirft */
.faq-heading {
  text-align: center;
  margin-bottom: 60px;
  margin-top: 20px;
  font-family: Times New Roman;
  font-size: xx-large;
  color: #333;
}

/*Style für Button */
.button {
  font-family: 'Arial', 'serif';
  margin-bottom: 20px;
}
/*Style für den main Container der Seite */
.faq-main-container {
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 100vw;
  padding-left: 5vw;
  padding-right: 5vw;
}
</style>
