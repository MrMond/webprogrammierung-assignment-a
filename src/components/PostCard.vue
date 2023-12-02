<!-- PostCard.vue -->
<script setup>
const props = defineProps(['title'])
</script>

<template>
  <VCard
      class="mx-auto"
      max-width="280"
      :title="props.title"
  >
    <!-- Hier könnten weitere Inhalte der Karte platziert werden -->
    <!-- <v-badge content="Beaches" color="error"/> -->
    <VDivider/>
    <VImg src="/Screenshot (10).png" alt="Your Image"/>
  </VCard>
</template>
