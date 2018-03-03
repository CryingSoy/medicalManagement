<template>
  <div class="container">
    <my-header></my-header>
    <my-footer></my-footer>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import myFooter from '../../components/footer/footer.vue'
export default {
  components: {
    myHeader,
    myFooter
  }
}
</script>

<style lang="less" scoped>

</style>
