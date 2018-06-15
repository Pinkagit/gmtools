<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-select v-model="formData.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="设置时间" prop="s_time">
                <el-date-picker
                v-model="formData.s_time"
                type="datetime"
                placeholder="选择日期时间"
                align="left"
                :picker-options="pickerOptions">
                </el-date-picker>
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
        return {
            formData: {
                zoneid: '',
                s_time: '',
                time: ''
            },
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                s_time: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            serverList: [],
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '明天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周后',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
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
                    this.formData.time = Date.parse(this.formData.s_time) / 1000;
                    console.log(this.formData);

                    let obj = {
                        zoneid: this.formData.zoneid,
                        time: this.formData.time
                    }

                    this.$ajax.post("/service/serverday", obj).then(response => {
                        console.log("feedback", response);

                        if (response.data.retcode == 0) {
                            this.$notify({
                                title: '错误',
                                message: response.data.retdesc,
                                type: 'error'
                            });
                        } else {
                            this.$notify({
                                title: '成功',
                                message: response.data.retdesc,
                                type: 'success'
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                    
                    
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

