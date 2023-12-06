import home from "@/views/posts/Home.vue";
import CatMemeGenerator from "@/views/Generator.vue";
import Meowsterpeace_Gallery from "@/views/Meowsterpeace.vue";
import Read from "@/views/posts/Read.vue";
import Create from "@/views/posts/Create.vue";

const routes = [
  {path: '/', component: home},
  {path: '/home', component: home},
  {path: '/home/:id', component: Read},
  {path: '/home/create', component: Create},
  {path: '/home', component: home},
  {path: '/home/save', component: home},
  {path: '/home/delete', component: home},
  {path: '/MeowsterpeaceGallery', component: Meowsterpeace_Gallery},
  {path: '/CatMemeGenerator', component: CatMemeGenerator},
];
export default routes;
