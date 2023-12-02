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
    <VImg src="/user1-128x128.jpg" alt="Your Image"/>
  </VCard>
</template>
