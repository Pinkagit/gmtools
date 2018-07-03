<template>
     <section class="content-box" :class="{'content-collapse': this.$store.state.isCollapse}">
         <!-- tag -->
         <tag></tag>
         <!-- breadCrumb -->
         <el-breadcrumb separator="/" class="breadCrumb">
            <el-breadcrumb-item class="breadCrumb-item">
                <i v-bind:class="get_breadcrumb_title[0]"></i>
                {{ get_breadcrumb_title[1] }}
            </el-breadcrumb-item>
            <el-breadcrumb-item class="breadCrumb-item">
                {{ get_breadcrumb_title[2] }}
            </el-breadcrumb-item>
        </el-breadcrumb>
         <!-- content -->
         <div class="content">
             <transition name="fade" mode="out-in">
                 <keep-alive :include="this.$store.state.includePageNames">
                    <router-view></router-view>
                </keep-alive>
             </transition>
         </div>
    </section>
</template>

<script>
import Tag from "@/components/tag";

export default {
    data() {
        return {
        }
    },
    components: {
        'tag': Tag
    },
    created() {
    },
    methods: {
    },
    computed: {
        get_breadcrumb_title() {
            return this.$store.state.breadcrumb_title;
        }
    }
}
</script>

<style lang="scss" scoped>
.content-box{
    position: absolute;
    left: $aside-width;
    right: 0;
    top: $header-height;
    bottom: 0;
    background: #eee;
    overflow-y: auto;
    transition: left .5s;
}
.content{
    width: 95%;
    min-height: 150px;
    background: #fff;
    margin: 0px auto;
    padding: 30px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 5px;
}
.content-collapse{
    left: 65px;
}
.breadCrumb{
    width: 95%;
    height: 50px;
    // background: lightblue;
    margin: 20px auto 0;
}
.breadCrumb-item{
    height: 50px;
    line-height: 50px;
    font-size: 17px;
}
.iconfont{
    font-size: 17px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>

