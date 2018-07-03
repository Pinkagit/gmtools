<template>
    <div>
        <el-row style="min-height:150px;">
            <el-col :span="7">
                <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px" @submit.native.prevent>
                    <el-form-item label="账号" prop="username">
                        <el-col :span="12">
                            <el-input v-model="formData.username" @keyup.native.enter="onSubmit"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="17">
                <transition name="slide-fade">
                    <el-card class="box-card" v-show="tableData.length > 0">
                        <div class="code-box">
                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="username" label="用户名"></el-table-column>

                                <el-table-column prop="name" label="姓名"></el-table-column>

                                <el-table-column prop="department" label="部门" :formatter="depFormat"></el-table-column>

                                <el-table-column prop="privilege" label="当前权限"></el-table-column>

                                <el-table-column label="新密码" width="200">
                                    <template slot-scope="scope">
                                        <el-col :span="18" style="padding-right:10px;">
                                            <el-input v-model="newPassword" size="small"></el-input>
                                        </el-col>                                  <el-col :span="6">
                                            <el-button type="primary" @click="certain(scope.row)" size="small">确定</el-button>
                                        </el-col>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </transition>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'forget_password',
    data() {
        return {
            formData: {
                username: ''
            },
            rules:{
            },
            tableData: [],
            newPassword: ''
        }
    },
    methods: {
        onSubmit() {
            console.log(this.formData);

            this.$ajax.post("/passwd", this.formData).then(response => {
                console.log("table", response);

                if (!response.data.err) {
                     let arr = [];
                    arr.push(response.data);
                    this.tableData = arr;
                } else {
                    this.$message({
                        message: response.data.err,
                        type: 'error'
                    })

                    this.tableData = []
                }
            })
            
        },
        depFormat(value, row, column) {
            switch (value.privilege) {
                case 2:
                    return "后台";
                case 3:
                    return '运营';
                case 4:
                    return '运维';
                case 5:
                    return '客服';
                default:
                    break;
            }            
        },
        certain(params) {
            let obj = {
                username: params.username,
                passwd: this.newPassword
            }
            console.log("obj", obj);
                        
            this.$ajax.post("/dopasswd", obj).then(response => {
                console.log("feedback", response);

                if (response.data.err == "成功") {
                    this.$message({
                        message: response.data.err,
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: response.data.err,
                        type: 'error'
                    })
                }
                
            }).catch(error => {
                console.log(error);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.box-card{
    width: 80%;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>

