<template>
  <div class="faq-page container">
    <v-row>
      <v-col cols="12">
        <h2 class="faq-heading">Common Curiosities</h2>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="faq-panel" style="margin-bottom: 25px;">
        <v-expansion-panel-header @click="togglePanel(index)" class="faq-question">
          {{ faq.question }}
          <v-icon v-if="openPanels.includes(index)">mdi-chevron-up</v-icon>
          <v-icon v-else>mdi-chevron-down</v-icon>
        </v-expansion-panel-header>
        <v-expansion-panel-content v-show="openPanels.includes(index)">
          <div class="faq-answer">{{ faq.answer }}</div>
        </v-expansion-panel-content>
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
import { ref } from 'vue';

const faqs = ref([
  { question: 'What type of cats can I upload?', answer: 'You can upload any feline. All cats are welcome in our memefactory!' },
  { question: 'Which data types can I upload?', answer: 'Your Meowsterpeace starts with a jpg, png or aviv file.' },
  { question: 'Any size limit for uploading images?', answer: 'No size limit per se, but remember, the bigger the file, the longer the loading time. We suggest keeping it under 5MB.' },
  { question: 'How to create the purrfect meme?', answer: 'Simply add your wittiest caption to the picture and voilà! You‘ve created your personal cat meme.' },
  { question: 'How do I change the font size of the text?', answer: 'You can change the size of the text with the page up and page down buttons on your keyboard.' },
  { question: 'What if I don’t have a cat photo?', answer: 'Worry not! We provide a variety of default images for you to choose from.' },

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
  margin-bottom: 35px;
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
}
</style>
