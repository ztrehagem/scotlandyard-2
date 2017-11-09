<template lang="pug">
  div.map-canvas
    canvas.canvas
</template>

<script>
import inner from '../modules/inner';
import MapCanvasController from '../modules/map-canvas-controller';

export default {
  data: () => ({
    mapCanvasController: null,
  }),
  methods: {
    setCanvasSize() {
      this.mapCanvasController.resetSize(this.$el);
    },
  },
  mounted() {
    const map = JSON.parse(inner.getMapJSON());
    const $canvas = this.$el.querySelector('.canvas');
    this.mapCanvasController = new MapCanvasController($canvas, map);
    window.addEventListener('resize', this.setCanvasSize);
    this.setCanvasSize();
  },
}
</script>
