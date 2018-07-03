<template>
    <div>
        <el-form ref="form" :inline="true" :model="formData" :rules="rules" label-width="100px">
            <el-form-item label="查询时间" prop="time">
                <el-date-picker
                v-model="formData.time"
                align="left"
                type="date"
                placeholder="选择日期"
                :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="Submit">确定</el-button>
            </el-form-item>
        </el-form>

        <div class="log_box">
            <p v-for="(item, index) in logs" :key="index" class="log_p">
                <mark>{{ item.slice(0, 25) }}</mark> {{ item.slice(26) }} 
            </p>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'query',
    data() {
        return {
            logs: [],
            formData: {
                time: ''
            },
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            rules: {
                time: [
                    { type: 'date', required: true ,message: '请选择日期', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        Submit() {

            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let obj = {
                        begintime: Date.parse(new Date(this.formData.time))
                    }
                    console.log("obj", obj);
                    
                    this.$ajax.post("/gmlog/", obj).then(response => {
                        console.log("logs", response);

                        if (response.data.retcode == 'exec_ok') {
                            if (response.data.retdesc != "") {
                                var re = /(\r\n)|(\n)|(\r)/g;
                                var arrRet =  response.data.retdesc.split(re);
                                
                                this.logs = arrRet.filter(function (item) {
                                    if (item != '' && item != undefined && item.length > 2) {
                                        return item;
                                    }                          
                                })
                            } else {
                                this.logs = ["暂无数据！"]
                            }
                            
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

<style lang="scss" scoped>
.log_box{
    padding-left: 25px;
}
.log_p{
    width: 100%;
    word-wrap:break-word;
    color: #666666;
}
mark{
    background: rgb(211, 238, 255);
    color: rgb(0, 105, 170);
}
</style>
