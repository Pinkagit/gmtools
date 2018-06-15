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

            <el-form-item label="选择时间" prop="time">
                <el-col :span="20">
                    <el-date-picker
                    v-model="timeValue"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="left" style="width:100%;">
                    </el-date-picker>
                </el-col>
            </el-form-item>
            
            <el-form-item label="封号原因" prop="reason">
                <el-col :span="20">
                    <el-input v-model="formData.reason"></el-input>
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
    data() {
        // 自定义验证规则
         var validate_time = (rule, value, callback) => {
            if (this.timeValue[0] == '' || this.timeValue[1] == '') {
                callback(new Error('请选择时间'));
            } else {
                callback();
            }
        }
        return{
            timeValue: [new Date(), ''],
            pickerOptions: {
                shortcuts: [{
                    text: '未来一天',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },{
                    text: '未来一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '未来一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '未来三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            formData: {
                zoneid: '',
                charid: '',
                begintime: '',
                endtime: '',
                reason: '犯错误了'
            },
            serverList:[],

            //
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                charid: [
                    { required: true, message: '请输入玩家ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字' }
                ],
                reason: [
                    { required: true, message: '请输入封号原因', trigger: 'blur' }
                ],
                time: [
                    { validator: validate_time, trigger: 'blur' }
                ]
            }
        }
       
    },
    created() {
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    },
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.banLogin();
                } else {
                    return false;
                }
            })
        },
        banLogin() {
            this.formData.begintime = Date.parse(new Date(this.timeValue[0])) / 1000;
            this.formData.endtime = Date.parse(new Date(this.timeValue[1])) / 1000;

            console.log("formData:", this.formData);
            
            this.$ajax.post("/player/banlogin", this.formData).then((response) => {
                console.log("feedback:", response);
                
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

<style lang="scss" scoped>
</style>
