<template lang="pug">
div
  h1 menu
  table
    thead: tr
      th join game
      th host game
    tbody: tr
      td
        form(@submit.prevent="join(joinInfo)")
          div: label
            span server ip address
            input(type="text" required placeholder="127.0.0.1" v-model.trim="joinInfo.address")
          div: label
            span server port number
            input(type="number" placeholder="default 23456" v-model.number="joinInfo.port")
          div: label
            span your name
            input(type="text" required v-model.trim="joinInfo.playerName")
          div
            button(type="submit") join
      td
        form(@submit.prevent="host(hostInfo)")
          div: label
            span port
            input(type="text" placeholder="default 23456" v-model.number="hostInfo.port")
          div: label
            span your name
            input(type="text" required v-model.trim="hostInfo.playerName")
          div
            button(type="submit") start
</template>

<script>
import inner from '../modules/inner';

export default {
  data: () => ({
    joinInfo: {
      address: null,
      port: null,
      playerName: null,
    },
    hostInfo: {
      port: null,
      playerName: null,
    },
  }),
  methods: {
    async join({address, port, playerName}) {
      await inner.startClient(address, port, playerName);
      this.$router.push({name: 'game'});
    },
    async host({port, playerName}) {
      await inner.startHost(port, playerName);
      this.$router.push({name: 'game', params: {host: true}});
    },
  },
};
</script>
