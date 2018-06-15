<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="文件名" prop="filename">
                <el-col :span="12">
                    <el-input v-model.number="formData.filename"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="选择服务器" prop="zoneid">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="formData.zoneid" @change="handleChecked">
                    <el-checkbox 
                    v-for="(item, index) in serverList" 
                    :label="item.zoneid" 
                    :key="index">
                        {{item.servername ? item.servername : item.zoneid + '区'}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            checkAll: false,
            isIndeterminate: false,
            formData: {
                filename: 'all',
                zoneid: []
            },
            rules: {
                zoneid: [
                    { type:'array', required: true, message: '请至少选择一个服务器', trigger: 'change' }
                ]
            },
            serverList: []
        }
    },
    created() {
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    },
    methods: {
        handleAllChange(value) {
            if (value) {
                let zoneidList = []
                for(let i = 0, len = this.serverList.length; i < len; i++) {
                    zoneidList.push(this.serverList[i].zoneid)
                }
                this.formData.zoneid = zoneidList;
                this.isIndeterminate = false;
            } else {
                this.formData.zoneid = [];
            }
        },
        handleChecked(value) {
            this.checkAll = value.length == this.serverList.length;
            this.isIndeterminate = value.length > 0 && value.length < this.serverList.length;
        },
        onSubmit() {

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.reloadCsv();
                } else {
                    return false;
                }
            })
        },
        reloadCsv() {
            console.log(this.formData);

            this.$ajax.post('/service/reloadcsv', this.formData).then(response => {
                console.log(response);
                
                if (response.data.retcode == "exec_ok") {
                    this.$notify({
                        title: '成功',
                        message: "操作成功",
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        title: '错误',
                        message: "Err",
                        type: 'error'
                    });
                }
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
</style>


