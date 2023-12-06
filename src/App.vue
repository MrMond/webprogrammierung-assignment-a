<template>
  <VLayout row wrap rounded rounded-md align-start>
    <VAppBar rounded class="white-background">
      <!-- Symbol für die Menüleiste -->
      <VAppBarNavIcon variant="text" @click.stop="drawer = !drawer"/>

      <!-- Toolbar Titel -->
      <v-toolbar class="white-background">
        <v-toolbar-title class="titel-schriftzug">CatMemeGenerator</v-toolbar-title>
      </v-toolbar>
    </VAppBar>

    <VNavigationDrawer mobile-breakpoint="sm" v-model="drawer" class="white-background">
      <VList>
        <!-- Navigationspunkte -->
        <VListItem prepend-icon="mdi-home" link to="/home" @click="handleNavigation">
          Home
        </VListItem>
        <VListItem prepend-icon="mdi-image" link to="/MeowsterpeaceGallery" @click="handleNavigation">
          Meowsterpeace Gallery
        </VListItem>
        <VListItem prepend-icon="mdi-paw" link to="/CatMemeGenerator" @click="handleNavigation">
          CatMemeGenerator
        </VListItem>
      </VList>

      <!-- Logo am unteren Ende -->
      <v-divider></v-divider>
      <v-row justify="center" align="center" class="logo-container">
        <img src="@/assets/Logos/cat-meme-generator_logo.png" alt="Logo" class="logo"/>
      </v-row>
    </VNavigationDrawer>

    <VMain>
      <RouterView></RouterView>
    </VMain>
  </VLayout>
</template>

<script setup>
import BlogIcon from "@/components/icons/IconBlog.vue";
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const drawer = ref(false)
const route = useRoute()
const router = useRouter()

const handleNavigation = () => {
  drawer.value = false
}
</script>

<style scoped>
@font-face {
  font-family: "Lobster";
  src: url("@/assets/fonts/Lobster-Regular.ttf") format("truetype");
}

.white-background {
  background-color: #ffffff; /* Weiß für die Hintergrundfarbe */
}

.titel-schriftzug {
  text-align: center;
  display: grid;
  place-items: center;
  background-color: white;
  font-family: Lobster;
  font-size: x-large;
}

.logo-container {
  padding: 16px; /* Anpassen Sie den Abstand nach Bedarf */
}

.logo {
  width: 175px; /* Anpassen Sie die Breite des Logos nach Bedarf */
}
</style>
