<template>
  <div class="container-big">
    <div>
      <h2 class="faq-heading">Common Curiosities</h2>
    </div>

    <v-expansion-panels v-for="(faq,index) in faqs" :key="index" cols="auto">
      <v-expansion-panel :title="faq.question"
        :text="faq.answer"
        class="mb-5">
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn class="button" @click="openNewQuestionDialog" color="#63775B" dark>Still curios?</v-btn>
      </v-col>
    </v-row>

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
import { reactive, ref, onMounted} from 'vue';
import { getFAQTuples } from "../components/db"


const faqs = ref([
  { question: '', answer: '' },
]);

const openPanels = ref([]);
const dialog = ref(false);
const email = "questions@meow.meme";

const togglePanel = (index) => {
  const isOpen = openPanels.value.includes(index);
  if (isOpen) {
    openPanels.value = openPanels.value.filter((item) => item !== index);
  } else {
    openPanels.value = [...openPanels.value, index];
  }
};

const openNewQuestionDialog = () => {
  dialog.value = true;
};

const closeNewQuestionDialog = () => {
  dialog.value = false;
};

async function loadFAQ() {
  try {
    const data = await getFAQTuples();
    if (data && data.length > 0) {
      faqs.value = reactive([...data]);
    }
  } catch {}
  console.log(faqs)
}

onMounted(async () => {
  await loadFAQ();
});
</script>

<style scoped>
.faq-page {
  background-color: #f0f0f0;
  padding-bottom: 250px;
  padding-top: 250px;
  padding-right: 200px;
  padding-left: 200px;

}

.faq-heading {
  text-align: center;
  margin-bottom: 60px;
  margin-top: 20px;
  font-family: Times New Roman;
  font-size: xx-large;
  color: #333;
}

.faq-panel {
  margin-bottom: 10px;
}

.faq-question {
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Arial', 'serif';
}

.faq-answer {
  font-size: 16px;
  margin-top: 10px;
  white-space: pre-line;
  font-family: 'Arial', 'serif';
}

.button {
  font-family: 'Arial', 'serif';
  margin-bottom: 20px;
}

.container-big {
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* Links ausrichten */
  align-items: center;
  height: 100%;
  /* 100% der Bildschirmhöhe */
  width: 100%;
  /* 50% der Bildschirmbreite */
  max-width: 100vw;
  /* Maximale Breite auf 50% der Bildschirmbreite begrenzen */
  padding-left: 5vw;
  padding-right: 5vw;
}</style>
