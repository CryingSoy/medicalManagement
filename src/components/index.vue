<template>
    <div id="index">
        <my-header></my-header>
        <my-footer></my-footer>
    </div>
</template>

<script>
import myHeader from './Header.vue'
import myFooter from './Footer.vue'

export default {
  name: 'index',
  data() {
    return {};
  },
  components: {
		myHeader,
		myFooter
	}
};


</script>

<style lang="less" scoped>
body > #app {
  margin: 0;
}

body, html{
  margin: 0;
  height: 100%;
  width: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

.box{
    width: 100%;
    height: 10%;
    background: #ebb647;
    font-size: 3em;
    text-align: center;
    cursor: pointer;
    color:white;
    display: flex;
    justify-content: center;
    align-items: center;
}

p {
  font-size: 1em;
}

.el-header, .el-footer {
    background-color: #409EFF;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
}

.el-header {
    margin-bottom: 60px;
}

.el-main {
    color: #333;
    text-align: center;
    line-height: 160px;
    /* overflow: hidden; */
}

.el-container {
    height: 100%;
    width: 100%;
    position: fixed;
}

.el-row{
    margin-bottom: 80px;
}

body > .el-container {
    margin-bottom: 40px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple-dark {
  background: #d3dce6;
}
</style>


