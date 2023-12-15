<template>
  <VLayout row wrap rounded rounded-md align-start>
    <VAppBar rounded class="white-background">
      <!-- Symbol für die Menüleiste -->
      <VAppBarNavIcon variant="text" @click.stop="drawer = !drawer"/>

      <!-- Toolbar Titel -->
      <v-toolbar class="titel-container"> 
        <v-toolbar-title class="titel-schriftzug">CatMemeGenerator</v-toolbar-title>
      </v-toolbar>
    </VAppBar>

    <v-navigation-drawer
        v-if="isMini"
        v-model="drawer"
        location="top"
        temporary
        class="white-background"
      >
      <v-list>
        <VListItem prepend-icon="mdi-home" link to="/home" @click="handleNavigation">
          Home
        </VListItem>
        <VListItem prepend-icon="mdi-image" link to="/MeowsterpeaceGallery" @click="handleNavigation">
          Meowsterpeace Gallery
        </VListItem>
        <VListItem prepend-icon="mdi-paw" link to="/CatMemeGenerator" @click="handleNavigation">
          CatMemeGenerator
        </VListItem>
        <VListItem prepend-icon="mdi-help-circle" link to="/CommonCuriosities" @click="handleNavigation">
          FAQ
        </VListItem>
        </v-list>
      </v-navigation-drawer>

    <VNavigationDrawer v-else v-model="drawer" class="white-background">
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
        <VListItem prepend-icon="mdi-help-circle" link to="/CommonCuriosities" @click="handleNavigation">
          FAQ
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

import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const { name } = useDisplay()

const isMini = computed(() => {
  switch (name.value) {
    case 'xs': return true
    case 'sm': return false
    case 'md': return false
    case 'lg': return false
    case 'xl': return false
    case 'xxl': return false
  }
})

const height = computed(() => {
  // name is reactive and
  // must use .value
  switch (name.value) {
    case 'xs': return 220
    case 'sm': return 400
    case 'md': return 500
    case 'lg': return 600
    case 'xl': return 800
    case 'xxl': return 1200
  }

  return undefined
})

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

.titel-container {
  width:100%;
  background-color: rgb(255, 255, 255);
  
}
.logo-container {
  padding: 16px;
}

.logo {
  width: 175px;
}
</style>
