<template>
  <h2 style='display:inline-block;margin:0 auto;' ></h2>
</template>

<script>
import Roller from './lib';
export default {
  props: {
    number: Number,
    width: {
      type: Number,
      default: 3
    }
  },
  mounted () {
    this._roller = new Roller({
      container: this.$el,
      width: this.width
    })
    this._roller.roll(this.number)
  },
  watch: {
    number (newVal, oldVal) {
      if (newVal.toString().length !== oldVal.toString().length) {
        this._roller.width = newVal.toString().length
        this._roller.setWidth()
      }
      this._roller.roll(newVal)
    }
  }
}
</script>
