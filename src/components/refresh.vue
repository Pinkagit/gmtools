<template>
    <div>
        <transition name="fade">
            <div class="btn-tip" v-show="tip_isShow">{{ tipMessage }}</div>
        </transition>
        <el-button ref="testttt" type="primary" icon="el-icon-refresh" circle :class="['refresh-btn', { 'rotate_360': isRotate }]" @click="refreshFun"></el-button>

    </div>
</template>

<script>
export default {
    props: ['tipMessage'],
    data() {
        return {
            isRotate: false,
            tip_isShow: true
        }
    },
    created() {
        setTimeout(() => {
            this.tip_isShow = false;
        }, 5000);
    },
    methods: {
        refreshFun() {
            this.isRotate = !this.isRotate;
            this.$emit('refresh');
        }
    }
}
</script>

<style lang="scss" scoped>
.refresh-btn{
    float: right;
    font-size: 17px;
    transition: all 2s;
}
.rotate_360{
    transform: rotate(360deg);
}
.btn-tip{
    height: 20px;
    background: #303133;
    position: absolute;
    right: 80px;
    top: 95px;
    color: aliceblue;
    padding: 7px;
    border-radius: 5px;
    font-size: 14px;
}
.btn-tip::after{
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 9px solid;
    border-color: #303133 transparent transparent transparent;
    position: absolute;
    bottom: -15px;
    right: 9px;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
    opacity: 0;
}
</style>

