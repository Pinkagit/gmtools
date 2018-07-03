<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="110px" @submit.native.prevent>
            <el-form-item label="倒计时（分钟）" prop="minute">
                <el-col :span="12">
                    <el-input v-model="formData.minute"></el-input>
                </el-col>
            </el-form-item>

            <checkbox-server></checkbox-server>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
import checkboxServer from "@/components/checkbox-server";

export default {
    name: 'close_server',
    components: {
        'checkbox-server': checkboxServer
    },
    data() {
        return {
            formData: {
                minute: '10',
                zoneid: []
            },
            rules: {

            }
        }
    },
    methods: {
        onSubmit() {
            this.formData.zoneid = this.$store.state.zoneid;
            console.log("formData", this.formData);
            
            this.$confirm('该操作将在倒计时结束关闭服务器，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$ajax.post("/service/stop", this.formData).then(response => {
                    console.log("feedback", response);
                
                    if (response.data.retcode == "0") {
                        this.$notify({
                            title: '成功',
                            message: response.data.retdesc,
                            type: 'success'
                        });
                    }
                }).catch(error => {
                    console.log(error);

                    this.$notify({
                        title: '错误',
                        message: "Err",
                        type: 'error'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


