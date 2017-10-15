<template lang="pug">
form(@submit.prevent="submit")
  ul
    li(v-for="client in clients")
      label
        input(v-if="selectable" type="radio" v-model="selected" :value="client.id" required)
        strong {{client.name}}
        strong(v-if="client.thief") [*]
        small {{client.id.substring(0, 8)}}
  button(v-if="selectable" type="submit") set thief player
</template>

<script>
export default {
  props: {
    clients: {type: Array, required: true},
    selectable: {type: Boolean, default: false},
  },
  data: () => ({
    selected: null,
  }),
  methods: {
    submit() {
      this.$emit('select', this.selected);
    },
  },
}
</script>
