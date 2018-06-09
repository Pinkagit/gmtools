<template>
     <header>
         <div class="icon-menu-box" @click="collapseChage">
            <i class="el-icon-menu"></i>
         </div>
         <div class="title">GMtools</div>
         <div class="out-box">
             <span class="out-name">
                <i class="el-icon-location"></i>
                {{ userinfo }}
            </span>
             <el-button type="primary" size="medium" class="out-button" @click="logout"><i class="iconfont icon-084tuichu"></i> 退出</el-button>
         </div>
     </header>
</template>

<script>
export default {
    data() {
        return {
            collapse: false,
            userinfo: ''
        }
    },
    methods: {
        collapseChage: function() {
            this.$store.commit("changeCollapse");
        },
        logout: function() {
            alert("logout");
        }
    },
    created() {
        // 获取用户名
        this.$ajax.get("/api/userinfo").then(response => {
            this.userinfo = response.data.user; 
        })
    }
}
</script>


<style lang="scss">
header{
    width: 100%;
    height: $header-height;
    background: #434A50;
}
.icon-menu-box{
    width: 65px;
    height: $header-height;
    float: left;
    cursor: pointer;
}
.icon-menu-box:hover{
    background: rgb(42, 47, 51);
}
.title{
    height: 100%;
    float: left;
    line-height: $header-height;
    font-size: 27px;
    color: aliceblue;
    padding-left: 5px;
}
.el-icon-menu{
    font-size: 32px;
    margin: ($header-height - 32px)/2 0 0 16px;
    color: aliceblue;
}
.out-box{
    width: 250px;
    height: 100%;
    float:right;
    padding-right:40px;
    line-height: $header-height;
}
.out-name{
    font-size: 18px;
    color: aliceblue;
}
.out-name>i{
    font-size: 19px;
    color: aliceblue;
}
.out-button{
    margin-left: 25px;
}
</style>
