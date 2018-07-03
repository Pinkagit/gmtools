<template>
    <div>
        <el-row style="min-height:150px;">
            <el-col :lg="7" :md="12">
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
            <el-col :lg="17">
                <transition name="slide-fade">
                    <el-card class="box-card" v-show="tableData.length > 0">
                        <div class="code-box">
                            <el-table :data="tableData" style="width: 100%">
                                <el-table-column prop="username" label="用户名"></el-table-column>

                                <el-table-column prop="name" label="姓名"></el-table-column>

                                <el-table-column prop="department" label="部门" :formatter="depFormat"></el-table-column>

                                <el-table-column prop="privilege" label="当前权限"></el-table-column>

                                <el-table-column label="设置权限" width="200">
                                    <template slot-scope="scope">
                                        <el-col :span="18" style="padding-right:10px;">
                                            <el-select size="small" v-model="newPri" placeholder="请选择">
                                                <el-option
                                                v-if="scope.row.myprivilege < item.pri_value"
                                                v-for="item in op_list"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                                </el-option>
                                            </el-select>
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
    name: 'reset_permissions',
    data() {
        return {
            formData: {
                username: ''
            },
            rules:{
            },
            tableData: [],
            newPri: '',
            op_list: []
        }
    },
    methods: {
        onSubmit() {
            console.log(this.formData);

            this.$ajax.post("/reset", this.formData).then(response => {
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
                privilege: this.newPri
            }
            console.log("obj", obj);
                        
            this.$ajax.post("/doreset", obj).then(response => {
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
    },
    created() {
        this.$ajax.get("/static/index.json").then(response => {
            console.log("index.json", response);

            this.op_list = response.data.depList;
        })
    }
}
</script>

<style lang="scss" scoped>
.box-card{
    width: 95%;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>

