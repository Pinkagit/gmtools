<template>
    <div class="wrap">
        <el-col :span="9">
            <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="100px" @submit.native.prevent>
                <el-form-item label="激活码" prop="code">
                    <el-col :span="12">
                        <el-input v-model="formData.code" @keyup.native.enter="onSubmit"></el-input>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="15">
            <transition name="slide-fade">
                <el-card class="box-card" v-show="tableData.length">
                    <div class="code-box">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="server" label="服务器校验码"></el-table-column>

                            <el-table-column prop="type" label="类型"></el-table-column>

                            <el-table-column prop="err" label="Err"></el-table-column>

                            <el-table-column prop="str" width="150" label="结果"></el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </transition>
        </el-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                code: ''
            },
            tableData: [],
            rules: {
                code: [
                    { required: true, message: '请输入激活码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    console.log(this.formData);
                    this.$ajax.post("/api/giftcode/check", this.formData).then(response => {
                        console.log("checkResult", response);
                        let t = [];
                        t[0] = response.data.data;
                        this.tableData = t; 
                        
                        this.$message({
                            message: "查询成功",
                            type: 'success'
                        })
                        
                    })
                } else {
                    return false;
                }
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    overflow: hidden;
}
.box-card{
    width: 550px;
}
.code-box{
    max-height: 170px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>


