<template>
    <div class="form-box">
        <p style="display:none;">{{ route }}</p>
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="协议号" prop="protocols">
                <el-col :span="12">
                    <el-input v-model="formData.protocols"></el-input>
                </el-col>
            </el-form-item>
            
            <checkbox-server prop="zoneid"></checkbox-server>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
import checkboxServer from "@/components/checkbox-server";

export default {
    components: {
        'checkbox-server': checkboxServer
    },
    data() {
        return {
            formData: {
                protocols: '',
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
        }
    }
}
</script>


<style lang="scss" scoped>

</style>
