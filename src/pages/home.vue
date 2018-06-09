<template>
    <div class="wrap">
       <g-header></g-header>
       <g-aside></g-aside>
       <g-content-box>
       </g-content-box>
    </div>
</template>

<script>
import header from "../components/header";
import aside from "../components/aside";
import contentBox from "../components/content-box";

export default {
    components: {
        "g-header": header,
        "g-aside" : aside,
        'g-content-box': contentBox
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    width: 100%;
    height: 100%;
    background: #eee;
}
</style>
