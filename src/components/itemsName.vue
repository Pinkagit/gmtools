<template>
    <div>
        <ul class="itemlist">
            <li v-for="(item, index) in itemList" :key="index" :class="{ errTip: isErr.indexOf(index) != -1 ? true : false }">
                <span class="item-name">{{ item.name }}</span><span class="item-num">{{ item.num }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
	props: ['itemList', 'isErr'],
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.itemlist{
	width: 100%;
	margin: 0;
    padding: 0;
    list-style: none;
}
.itemlist>li{
	margin-top: 10px;	
	float: left;
	margin-right: 5px;
	height: 26px;
	line-height: 26px;
}
.item-name{
	padding: 5px;
	background: #66B1FF;
	border-radius: 5px 0 0 5px;
	color: #fff;
}
.item-num{
	padding: 5px;
	background: #545C64;
	border-radius: 0 5px 5px 0;
	color: #fff;
}
.errTip{
	box-shadow: 0 0 7px 0.3px red;
	border-radius: 5px;
}
</style>


