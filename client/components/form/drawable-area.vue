<template>
  <canvas
    style="border: 1px solid rgba(0, 0, 0, 0.12); width: 100%; height: 100%;"
    ref="canvas"
    @mousedown="beginDrawing"
    @mousemove="keepDrawing"
    @mouseup="stopDrawing"
    @mouseleave="stopDrawing"
  />
</template>
<script>
export default {
  name: 'AppDrawableArea',
  props: ['value', 'disable'],
  data() {
    return {
      x: 0,
      y: 0,
      isDrawing: false,
      canvas: null
    };
  },
  watch: {
    value(newVal) {
      this.load(newVal);
    }
  },
  methods: {
    load(data) {
      if (!data) {
        this.handleClear();
      } else {
        const img = new Image();
        img.onload = () => {
          this.canvas.drawImage(img, 0, 0);
        };
        img.src = data;
      }
    },
    drawLine(x1, y1, x2, y2) {
      const ctx = this.canvas;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    },
    beginDrawing(e) {
      if (this.disable) return;
      this.x = e.offsetX;
      this.y = e.offsetY;
      this.isDrawing = true;
    },
    keepDrawing(e) {
      if (this.disable) return;
      if (this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = e.offsetX;
        this.y = e.offsetY;
      }
    },
    stopDrawing(e) {
      if (this.disable) return;
      if (this.isDrawing === true) {
        this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
        this.x = 0;
        this.y = 0;
        this.isDrawing = false;
        this.$emit('input', this.canvas.canvas.toDataURL());
      }
    },
    handleClear() {
      this.canvas = this.$refs.canvas.getContext('2d');
      const c = this.canvas.canvas;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.beginPath();
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas.getContext('2d');
    this.$refs.canvas.width = this.$refs.canvas.offsetWidth;
    this.$refs.canvas.height = this.$refs.canvas.offsetHeight;
    this.load(this.value);
  }
};
</script>
