<template lang="pug">
  div {{map.slug}}
</template>

<script>
import inner from '../modules/inner';

export default {
  data: () => ({
    map: JSON.parse(inner.getMapJSON()),
  }),
  created() {
    console.log('hoge');
  },
}
</script>
