<script>
export default {
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    const { Marker } = this.google.maps;

    // eslint-disable-next-line no-new
    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map
    });
  },

  // eslint-disable-next-line vue/require-render-return
  render() {}
};
</script>
