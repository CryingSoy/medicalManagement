<template>
    <div id="index">
        <my-header></my-header>
    </div>
</template>

<script>
import myHeader from './header/Header.vue'

export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    myHeader
  }
}
</script>

<style lang="less" scoped>
</style>