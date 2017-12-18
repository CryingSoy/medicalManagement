<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  },
  methods: {}
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

html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
abbr, address, cite, code,
del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var,
b, i,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
    margin:0;
    padding:0;
}

h1,
h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}

/* 清除type=number的默认上下箭头样式 */
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
  -webkit-appearance:textfield;
}

input[type="number"]{
        -moz-appearance:textfield;
}
</style>
