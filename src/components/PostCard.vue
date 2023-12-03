<!-- PostCard.vue -->
<script setup>
const props = defineProps(['title', 'imgSrc', 'largeView'])
</script>

<template>
  <VCard
      class="mx-auto"
      :max-width="largeView ? 600 : 280"
      :height="largeView ? 'auto' : 200"
      :style="{cursor: largeView ? 'auto' : 'pointer'}"
  >
    <VCardTitle>{{ title }}</VCardTitle>
    <VDivider v-if="largeView"/>
    <VImg v-if="imgSrc" :src="imgSrc" :alt="title" :height="largeView ? '100%' : 'auto'" :width="largeView ? '100%' : 'auto'" />
  </VCard>
</template>
