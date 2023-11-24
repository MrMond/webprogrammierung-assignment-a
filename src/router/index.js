import Community from "@/views/Community.vue";
import Documentation from '../views/Documentation.vue'
import Ecosystem from "@/views/Ecosystem.vue";
import Support from "@/views/Support.vue";
import Tooling from "@/views/Tooling.vue";

const routes = [
  {path: '/community', component: Community},
  {path: '/doc', component: Documentation},
  {path: '/eco', name:"Ecosystem", component: Ecosystem},
  {path: '/support', component: Support},
  {path: '/tools', name:"Tooling", component: Tooling},
];
export default routes;
