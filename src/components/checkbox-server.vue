<template>
    <el-form-item label="选择服务器">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="zoneid" @change="handleChecked">
            <el-checkbox 
            v-for="(item, index) in serverList"
            :label="item.zoneid" 
            :key="index">
                {{item.servername ? item.servername : item.zoneid + '区'}}
            </el-checkbox>
        </el-checkbox-group>
    </el-form-item>
</template>

<script>
export default {
    data() {
        return {
            checkAll: false,
            isIndeterminate: false,
            serverList: [],
            zoneid: []
        }
    },
    methods: {
        handleAllChange(value) {
            if (value) {
                let zoneidList = []
                for(let i = 0, len = this.serverList.length; i < len; i++) {
                    zoneidList.push(this.serverList[i].zoneid)
                }
                this.zoneid = zoneidList;
                this.$store.commit("change_checkbox_server", this.zoneid)
                
                this.isIndeterminate = false;
            } else {
                this.zoneid = [];
                this.$store.commit("change_checkbox_server", this.zoneid)
            }
        },
        handleChecked(value) {
            this.checkAll = value.length == this.serverList.length;
            this.isIndeterminate = value.length > 0 && value.length < this.serverList.length;
            
            this.$store.commit("change_checkbox_server", this.zoneid)
        }
    },
    created() {
        // 获取服务器列表
        this.$ajax.get("/api/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    }
}
</script>

