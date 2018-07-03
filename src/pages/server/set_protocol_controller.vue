<template>
    <div class="form-box">
        <p style="display:none;">{{ route }}</p>
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="协议号" prop="protocols">
                <el-col :span="12">
                    <el-input v-model="formData.protocols"></el-input>
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
    name: 'set_protocol_controller',
    components: {
        'checkbox-server': checkboxServer
    },
    data() {
        return {
            formData: {
                protocols: '1001;1002',
                zoneid: []
            },
            rules: {
                
            }
        }
    },
    created() {
       
    },
    computed: {
        //
        route() {
            if (this.$route.path.replace('/','') == "set_protocol_controller") {
                let breadcrumb_title = ["iconfont icon-fuwuqi", "服务器", "协议控制"]
                this.$store.commit("set_breadcrumb_title", breadcrumb_title);
            }
        }
    },
    methods: {
        onSubmit() {
            this.formData.zoneid = this.$store.state.zoneid;
            console.log(this.formData);

            this.$ajax.post("/service/addprotocol", this.formData).then(response => {
                console.log(response);

                if (response.data.retcode == "error") {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        type: 'error'
                    });
                } else {
                    this.$notify({
                        title: '成功',
                        message: "成功",
                        type: 'success'
                    });
                }
                
            }).catch(error => {
                console.log(error);
            })
            
        }
    }
}
</script>


<style lang="scss" scoped>

</style>
