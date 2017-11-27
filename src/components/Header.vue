<template>
    <header>
        <div class="nav">
            <div class="title">广州大学华软软件学院高校医疗信息管理系统</div>
        </div>
    </header>
</template>
<script>
export default {
    methods:{
        jiayi(){
            this.$store.dispatch('jiayi');
        }
    }
}
</script>

<style lang="less" scoped>
.nav {
    width: 100%;
    height: 100%;
    background-color: #c2c;
    font-size: 1px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    .title {
        width: 50%;
        height: 50%;
        background: #999;
        font-size: 30em;
        padding: 0.5em 0;
    }
}

</style>

