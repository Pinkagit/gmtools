<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-select v-model="formData.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="输入玩家ID" prop="charid" >
                <el-col :span="12">
                    <el-input v-model.number="formData.charid" placeholder="输入玩家ID"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="货币类型" prop="type">
                <el-select v-model="formData.type" placeholder="货币类型">
                    <el-option v-for="item in currencyType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="num">
                <el-col :span="12">
                    <el-input v-model.number="formData.num"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "add_currency",
    data() {
        return{
            formData: {
                zoneid: '',
                charid: '',
                type: '',
                num: ''
            },
            serverList: [],
            currencyType: [],
            // 表单验证规则
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                charid: [
                    { required: true, message: '请输入玩家ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字' }
                ],
                type: [
                    { required: true, message: '请选择货币类型', trigger: 'change' }
                ],
                num: [
                    { required: true, message: '请输入数量', trigger: 'blur' },
                    { type: 'number', message: '数量必须为数字' }
                ]
            }
        }
    },
    created() {
        // 获取货币类型列表
        this.$ajax.get("/static/index.json").then((response) => {
            this.currencyType = response.data.currencyType;
        })
        // 获取服务器列表
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    },
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.AddCurrency();
                } else {
                    return false;
                }
            })
        },
        AddCurrency() {
            console.log(this.formData);
            
            this.$ajax.post('/player/currency', this.formData).then( response => {
                console.log("feedback:", response);
                //
                if (response.data.retcode == "exec_ok") {
                    this.$notify({
                        title: '成功',
                        message: response.data.retdesc,
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        type: 'error'
                    });
                }
                
            })
        }
    }
}
</script>

