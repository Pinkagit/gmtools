<template>
    <div class="wrap">
        <el-col :span="9">
            <div class="form-box">
                <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
                    <el-form-item label="选择服务器" prop="zoneid">
                        <el-select v-model="formData.zoneid" placeholder="选择服务器">
                            <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="GetProtocol">查询</el-button>
                        <el-button type="success" @click="LoadProtocol">添加</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>

        <el-col :span="15">
            <transition name="slide-fade">
                <el-card class="box-card" v-show="table_isShow">
                    <div class="code-box">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column label="协议号">
                                <template slot-scope="scope">
                                    {{ scope.row }}
                                </template>
                            </el-table-column>

                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleOper(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
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
                zoneid: ""
            },
            rules: {
                zoneid: [
                    {  required: true, message: '请选择服务器', trigger:'change' }
                ],
            },
            serverList: [],
            tableData: [],
            table_isShow: false
        }
    },
    created() {
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    },
    methods: {
        handleOper(index, params) {
            let obj = {
                protocol: params,
                zoneid: this.formData.zoneid
            }

            console.log("obj", obj);

            this.$ajax.post("/service/delprotocol", obj).then(response => {
                console.log("feedback", response);

                if (response.data.retcode == "error") {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        type: 'error'
                    });
                } else if (response.data.retcode == "ok") {
                    this.$notify({
                        title: '成功',
                        message: response.data.retdesc,
                        type: 'success'
                    });

                    this.tableData.splice(index, 1);
                }
                
            })
            
            
        },
        GetProtocol() {

            this.$refs['form'].validate((valid) => {
                if (valid) {
                   console.log(this.formData);

                    this.$ajax.post("/service/getprotocol", this.formData).then(response => {
                        console.log("GetProtocol", response);

                        if (response.data.retcode == "error") {
                            this.$notify({
                                title: '错误',
                                message: response.data.retdesc,
                                type: 'error'
                            });
                        } else {
                            this.table_isShow = true;
                            this.tableData = response.data.retdata.protocols;
                        }
                       
                    })

                } else {
                    return false;
                }
            })
        },
        LoadProtocol() {
            this.$router.push({ path: '/set_protocol_controller' })
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    overflow: hidden;
}
.form-box{
    width: 100%;
}
.box-card{
    width: 550px;
}


.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
