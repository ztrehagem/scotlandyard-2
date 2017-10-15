<template lang="pug">
div
  h1 game
  client-list(:clients="clients" :selectable="this.isHost" @select="setThiefPlayer")
  button(v-if="!this.game && this.isHost" type="button" @click.prevent="startGame") START NEW GAME
  .game-box(v-if="this.game")
    .game-box-header
      .turn TURN {{game.turn}}
      .player {{player}}
    hr
    .debug-box
      form(@submit.prement="debugThief")
        button(type="submit") 怪盗ACT
        ul
          li
            div movement
            ul
              li: label
                span type
                input(type="text" v-model.trim="test.thief.movement.type" required)
              li: label
                span dest
                input(type="number" v-model.number="test.thief.movement.dest" required)
          li
            div movement2
            ul
              li: label
                span type
                input(type="text" v-model.trim="test.thief.movement2.type")
              li: label
                span dest
                input(type="number" v-model.number="test.thief.movement2.dest")
      form(@submit.prevent="debugPolice")
        button(type="submit") 刑事ACT
        ul
          li: label
            span id
            input(type="number" v-model.number="test.police.id" required)
          li
            div movement
            ul
              li: label
                span type
                input(type="text" v-model.trim="test.police.movement.type" required)
              li: label
                span dest
                input(type="number" v-model.number="test.police.movement.dest" required)
</template>

<script>
import inner from '../modules/inner';
import ClientList from './client-list.vue';

export default {
  components: {
    ClientList,
  },
  data: () => ({
    isHost: false,
    clients: [],
    game: null,
    test: {
      thief: {
        movement: {},
        movement2: {},
      },
      police: {
        id: null,
        movement: {},
      },
    },
  }),
  computed: {
    player() {
      switch (this.game.player) {
        case 'thief': return '怪盗';
        case 'police': return `刑事 (${this.policeColor})`;
      }
    },
    policeColor() {
      switch (this.game.activePoliceId) {
        case 0: return '赤';
        case 1: return '青';
        case 2: return '黃';
        case 3: return '緑';
        case 4: return '黒';
      }
    },
  },
  methods: {
    onUpdate() {
      this.clients = inner.getClients();
      this.game = inner.getGame();
    },
    startGame() {
      inner.startGame();
    },
    setThiefPlayer(thiefPlayerId) {
      inner.setThiefPlayer(thiefPlayerId);
    },
    async debugThief() {
      const movement2 = Object.keys(this.test.thief.movement2).length ? this.test.thief.movement2 : undefined;
      await inner.actThief(this.test.thief.movement, movement2);
      this.test.thief = {
        movement: {},
        movement2: {},
      };
    },
    async debugPolice() {
      await inner.actPolice(this.test.police.id, this.test.police.movement);
      this.test.police = {
        id: null,
        movement: {},
      };
    },
  },
  created() {
    this.isHost = !!this.$route.params.host;
    inner.on('update', () => this.onUpdate());
    this.onUpdate();
  },
}
</script>
