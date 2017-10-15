import TopPage from '../components/top-page.vue';
import GamePage from '../components/game-page.vue';

export const routes = [
  { name: 'top', path: '/', component: TopPage },
  { name: 'game', path: '/game', component: GamePage },
];
