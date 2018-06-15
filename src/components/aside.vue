<template>
    <aside>
        <el-menu 
        :default-active="onRoutes" 
        class="el-menu-vertical-demo" 
        @open="handleOpen" 
        @close="handleClose" 
        @select="handleSelect" 
        :collapse="this.$store.state.isCollapse" 
        router 
        unique-opened
        background-color="#545c64" 
        text-color="#fff" 
        active-text-color="#ffd04b">
            <el-submenu 
                v-if="item.list" 
                v-for="item in items" 
                :key="item.index" 
                :index="item.index">
                <template slot="title" >
                    <i v-bind:class="item.className"></i>
                    <span>{{ item.title }}</span>
                </template>

                <el-menu-item v-for="subItem in item.list" :key="subItem.index" :index="subItem.index">
                    {{ subItem.value }}
                </el-menu-item>
            </el-submenu>

            <el-menu-item v-else :index="item.index" :key="item.index">
                <i :class="item.className"></i><span slot="title">{{ item.title }}</span>
            </el-menu-item>
            
        </el-menu>
    </aside>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            items: [],
            breadcrumb_title: []
        }
    },
    methods: {
        handleOpen(key, keyPath) {  // sub-menu 展开回调
            // console.log("open", key, keyPath);
        },
        handleClose(key, keyPath) { // sub-menu 收起回调
        },
        handleSelect(key, keyPath){         // 菜单激活回调
        }
    },
    /* 组件实例创建完成，属性已绑定，但DOM还未生成，$el属性还不存在 */
    created() { 
        var _this = this;

        // 请求aside列表
        this.$ajax.get("/player/aside").then(function (response) {
            console.log("aside:",response);
            _this.items = response.data.mynav;
            
        }).catch(function (response) {
            console.log(response);
        })

        
    },
    computed: {
        onRoutes() {
            var _route = this.$route.path.replace('/','');

            if (this.items.length != 0) {
                for(let i = 0, len = this.items.length; i < len; i++) {
                    if (this.items[i].list) {
                        for(let j = 0, len = this.items[i].list.length; j < len; j++) {
                            if (this.items[i].list[j].index == _route) {
                                this.breadcrumb_title[0] = this.items[i].className;
                                this.breadcrumb_title[1] = this.items[i].title;
                                this.breadcrumb_title[2] = this.items[i].list[j].value;
                                break;
                            }
                        }
                    }
                }
                this.$store.commit("set_breadcrumb_title", this.breadcrumb_title);
                
                return _route;
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
aside{
    background: #545c64;
    width: $aside-width;    
    position: absolute;
    top: $header-height;
    left: 0;
    bottom: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: $aside-width;
    height: 100%;
}
aside>ul {
    height:100%;
    border-right: none;
}
.iconfont{
    font-size: 25px;
    margin-right: 5px;
}
</style>

