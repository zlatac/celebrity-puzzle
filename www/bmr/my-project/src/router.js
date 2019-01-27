import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home";
import Spotify from "./components/Spotify";
import DjSpotify from "./components/DjSpotify";
import Landing from "./components/Landing";
import Report from "./components/Report";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    { path: '/request/:id', component: Spotify },
    { path: '/dj/:id', component: DjSpotify },
    { path: '/', component: Landing },
    { path: '/home', component: Home },
    { path: '/report', component: Report },
    { path: '*', redirect: '/' }, // wild card situations since the shared url could be modified by users
  ]
});
