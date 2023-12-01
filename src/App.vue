<script setup>
import BlogIcon from "@/components/icons/IconBlog.vue";
import {ref} from 'vue'

const drawer = ref(true)
</script>

<template>
  <VLayout row wrap rounded rounded-md align-start>
    <VAppBar rounded class="white-background">
      <VAppBarNavIcon variant="text" @click.stop="drawer = !drawer"/>
      <VToolbarTitle>Travel Blog</VToolbarTitle>

      <VSpacer></VSpacer>
      <VBtn variant="text" icon="mdi-magnify"></VBtn>
      <VBtn variant="text" icon>
        <VIcon>mdi-filter</VIcon>
        <VMenu activator="parent">
          <VList density="compact">
            <VListItem>Attractions</VListItem>
            <VListItem>Beaches</VListItem>
            <VListItem>Cities</VListItem>
            <VListItem>Escape Rooms</VListItem>
            <VListItem>Mountains</VListItem>
            <VListItem>Museums</VListItem>
            <!--das hier ist die drop down bar-->
          </VList>
        </VMenu>
      </VBtn>

      <VBtn variant="text" icon>
        <VIcon>mdi-dots-vertical</VIcon>
        <VMenu activator="parent">
          <VList density="compact">
            <VListItem>Profile</VListItem>
            <VListItem>Settings</VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </VAppBar>



    <VNavigationDrawer mobile-breakpoint="sm" v-model="drawer" class="white-background">
      <VList>
        <VListItem :prepend-icon="BlogIcon" link to="/home">
          Home
        </VListItem>
        <VListItem prepend-icon="mdi-shape" link to="/Meowsterpeace Gallery">
          Meowsterpeace Gallery
        </VListItem>
        <VListItem prepend-icon="mdi-account-multiple" link to="/CatMemeGenerator">
          CatMemeGenerator
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <RouterView></RouterView>
    </VMain>
    <VBtn link to="/posts/create"
          variant="elevated" icon="mdi-plus" color="indigo-darken-4"
          position="fixed" size="large" style="bottom:5em; right:3em">
    </VBtn>


  </VLayout>
</template>

<style scoped>
.white-background {
  background-color: #ffffff; /* Weiß für die Hintergrundfarbe */
}
</style>
