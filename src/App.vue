<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import myHeader from './components/Header.vue'
import myFooter from './components/Footer.vue'
export default {
  name: 'ap11p',
  data () {
    return {
      msg: '111111111111'
    }
  },
  methods: {
    test () {
      this.$axios
        .get('/test', {})
        .then(response => {
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  components: {
    myHeader,
    myFooter
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
