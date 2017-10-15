<template lang="pug">
div
  h2 menu
  table
    thead: tr
      th join game
      th host game
    tbody: tr
      td
        form(@submit.prevent="join(joinInfo)")
          div: label
            span server ip address
            input(type="text" placeholder="127.0.0.1" v-model.trim="joinInfo.address")
          div: label
            span server port number
            input(type="number" placeholder="default 23456" v-model.number="joinInfo.port")
          div: label
            span your name
            input(type="text" v-model.trim="joinInfo.playerName")
          div
            button(type="submit") join
      td
        form(@submit.prevent="host(hostInfo)")
          div: label
            span port
            input(type="text" placeholder="default 23456" v-model.number="hostInfo.port")
          div: label
            span your name
            input(type="text" v-model.trim="hostInfo.playerName")
          div
            button(type="submit") start
</template>

<script>
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
    join({address, port, playerName}) {
      console.log('join', arguments);
    },
    host({port, playerName}) {
      console.log('host', arguments);
    },
  },
};
</script>
