import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import UserList from "../components/UserList.vue";
import Statistic from "../components/Statistic.vue";
import Rank from "../components/Rank.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
        {
          path: "/user",
          component: UserList,
        },
        {
          path: "/statistic",
          component: Statistic,
        },
        {
          path: "/rank",
          component: Rank,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path == "/" || to.path == "/login") return next();
  const userSession = window.sessionStorage.getItem("user");
  if (!userSession) return next("/login");
  next();
});

export default router;
