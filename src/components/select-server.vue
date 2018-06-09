<template>
    <el-select placeholder="请选择活动区域">
        <el-option></el-option>
    </el-select>
</template>

<script>
export default {
    data() {
        return {
            serverList: []
        }
    },
    created() {

        this.$ajax.get("/api/serverlist").then((response) => {
            console.log("serverList:", response);
        })
        
    }
}
</script>

