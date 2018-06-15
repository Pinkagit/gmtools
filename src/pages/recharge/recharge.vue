<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="serverid">
                <el-select v-model="formData.serverid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="输入玩家ID" prop="roleid" >
                <el-col :span="12">
                    <el-input v-model.number="formData.roleid" placeholder="输入玩家ID"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="充值ID" prop="rechargeid" >
                <el-col :span="12">
                    <el-input v-model="formData.rechargeid" placeholder="输入充值ID" @input="getRechargeName"></el-input>

                    <span class="recahrge-name"
                    v-show="formData.rechargename" :class="[formData.rechargename=='未知' ? 'errTip' : '']">{{ formData.rechargename }}</span>
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
        return {
            formData: {
                serverid: '',
                roleid: '',
                rechargeid: '',
                rechargename: '',
                time: ''
            },
            rules: {
                serverid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                roleid: [
                    { required: true, message: '请输入玩家ID', trigger: 'blur' },
                    { type: 'number', message: 'ID必须为数字' }
                ],
                rechargeid: [
                    { required: true, message: '请输入充值ID', trigger: 'blur' }
                ],
            },
            serverList: []
        }
    },
    created() {
        // 
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    },
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.rechargeFnc();
                } else {
                    return false;
                }
            })
        },
        rechargeFnc() {
            let nowTime = new Date().toLocaleString();
            this.formData.time = nowTime;
            console.log("formData", this.formData);

            this.$ajax.post("/freecharge/send", this.formData).then(response => {
                console.log("feedback", response);
                if (response.data.retcode == "error") {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        position: 'bottom-right',
                        type: 'error'
                    });
                } else {
                    this.$notify({
                        title: '成功',
                        message: response.data.retdesc,
                        position: 'bottom-right',
                        type: 'success'
                    });
                }
            }).catch(error => {
                console.log(error);
            })
            
        },
        getRechargeName() {
            if (this.formData.rechargeid !== "") {
                let obj = {
                    "rechargeid": this.formData.rechargeid
                }
                this.$ajax.post("/qurechargename", obj).then(response => {
                    console.log("rechargeName", response);

                    this.formData.rechargename = response.data.rechargename;
                    
                }).catch(error => {
                    console.log(error);
                })
            } else {
                this.rechargename = ""
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.recahrge-name{
    padding: 5px;
	background: #66B1FF;
	border-radius: 5px;
	color: #fff;
}
.errTip{
    box-shadow: 0 0 7px 0.3px red;
	border-radius: 5px;
}
</style>


