<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
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

            <el-form-item label="消息类型" prop="arrtype">
                <el-checkbox-group v-model="arrtype">
                    <el-checkbox 
                    v-for="(item, index) in typeList" 
                    :label="item.value" 
                    :key="index">
                        {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="频道" prop="channal">
                <el-select v-model="formData.channal">
                    <el-option v-for="item in channalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="玩家ID" prop="charid">
                <el-col :span="12">
                    <el-input v-model.number="formData.charid" placeholder="输入玩家ID"></el-input>
                </el-col>
            </el-form-item> -->

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
            
            <el-form-item label-width="0">
                <el-col :span="12">
                    <el-form-item label="间隔时间(s)" prop="evr">
                        <el-input v-model.number="formData.evr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="发送次数" prop="num">
                        <el-input v-model.number="formData.num"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            
            <el-form-item label="消息标题" prop="title">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
            
            <el-form-item label="消息内容" prop="content">
                <el-input type="textarea" autosize v-model="formData.content" placeholder="恭喜游戏上线..."></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'send_radio',
    data() {
        // 自定义验证规则
        var validate_type = (rule, value, callback) => {
            if (this.arrtype.length == 0) {
                callback(new Error('至少选择一种消息类型'))
            } else {
                callback();
            }
        }
        var validate_time = (rule, value, callback) => {
            if (this.timeValue[0] == '' || this.timeValue[1] == '') {
                callback(new Error('请选择时间'));
            } else {
                callback();
            }
        }


        return {
            timeValue: [new Date(), ''],
            arrtype: [],
            checkAll: false,
            isIndeterminate: false,
            formData: {
                zoneid: [],
                type: 0,
                channal: '',
                // charid: '',
                start: '',
                end: '',
                evr: 10,
                num: 10,
                title: '补偿公告001',
                content: ''
            },
            rules: {
                zoneid: [
                    { type:'array', required: true, message: '请至少选择一个服务器', trigger: 'change' }
                ],
                arrtype: [
                    { validator: validate_type, trigger: 'change' }
                ],
                channal: [
                    { required: true, message: '请选择频道', trigger: 'change' }
                ],
                /* charid: [
                    { required: true, message: '请输入玩家ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字' }
                ], */
                time: [
                    { validator: validate_time, trigger: 'blur' }
                ],
                evr: [
                    { required: true, message: '请输入间隔时间', trigger: 'blur' },
                    { type: 'number', message: '必须为数字' }
                ],
                num: [
                    { required: true, message: '请输入发送次数', trigger: 'blur' },
                    { type: 'number', message: '必须为数字' }
                ],
                content: [
                    { required: true, message: '请输入消息内容', trigger: 'blur' },
                ]
            },
            serverList: [],
            channalList: [],
            typeList: [
                { value: 257, name: '聊天框' },
                { value: 2, name: '屏幕提示' },
                { value: 4, name: '跑马灯' },
                { value: 8, name: '大屏幕' },
                { value: 16, name: 'board' },
                { value: 32, name: '消息框' },
            ],
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
        }
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
                this.formData.zoneid = []
            }
        },
        handleChecked(value) {
            this.checkAll = value.length == this.serverList.length;
            this.isIndeterminate = value.length > 0 && value.length < this.serverList.length;
        },

        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.sendRadio();
                } else {
                    return false;
                }
            })
            
        },
        sendRadio() {
            this.formData.start = Date.parse(new Date(this.timeValue[0]));
            this.formData.end = Date.parse(new Date(this.timeValue[1]));

            for(let i = 0, len = this.arrtype.length; i < len; i++) {
                this.formData.type += Number(this.arrtype[i]);
            }
            console.log("formData", this.formData);

            this.$ajax.post("/broadcast/send", this.formData).then(response => {
                console.log("feedback", response);

                if (response.data.retcode == "exec_ok") {
                    this.$notify({
                        title: '成功',
                        message: '发送成功',
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        type: 'error'
                    });
                }
                
            }).catch(error => {
                console.log(error);
            })
        }
    },
    created() {
        // 获取服务器列表
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })

        // 获取频道列表
        this.$ajax.get("/static/index.json").then(response => {
            this.channalList = response.data.channelList;
        })
    }
}
</script>

<style lang="scss" scoped>
.form-box{
    width: 700px;
}
</style>

