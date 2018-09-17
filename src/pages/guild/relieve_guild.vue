<template>
    <div>
        <el-form ref="form" :inline="true" :rules="rules" :model="formData" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-select v-model="formData.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公会ID" prop="leagueid">
                <el-input v-model.number="formData.leagueid" placeholder="输入公会ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- table -->
        <el-table class="table-wrap" style="width: 100%" stripe border :data="tableData" v-loading="loading">
            <el-table-column
                prop="leagueid"
                label="公会ID">
            </el-table-column>

             <el-table-column
                prop="leaguename"
                label="公会名">
            </el-table-column>
         
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="toDel(scope.row, scope.$index)">解散</el-button>
                </template>
            </el-table-column>
        </el-table>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                zoneid: '',
                leagueid: '',
            },
            loading:false,
            serverList: [],
            tableData: [],
            //
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                leagueid: [
                    { required: true, message: '请输入公会Id', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
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
                    this.loading = true;

                    this.$ajax.post("/league", this.formData).then(response => {
                        console.log(response);
                        this.loading = false;

                        if (response.data.retcode == 'error') {
                            this.$message.error(response.data.retdesc);
                        } else {
                            if (response.data.retdata) {
                                let arr = [response.data.retdata]
                                this.tableData = arr;
                            } else {
                                this.$message.warning("未查询到公会")
                            }
                        }

                    }).catch(error => {
                        console.log(error);
                        this.loading = false;
                    })
                } else {
                    return false;
                }
            })
            
        },
        toDel(params, index) {
            console.log(params, index);

            let obj = {
                leagueid: params.leagueid,
                zoneid: this.formData.zoneid,
            }

            console.log(obj);
            

            this.$ajax.post("/league/delleague", obj).then(response => {
                console.log(response);

                if (response.data.retcode == 'error') {
                    this.$message.error(response.data.retdesc);
                } else if (response.data.retcode == 'ok') {
                    this.$message.success("操作成功！")
                }
                
            }).catch(error => {
                console.log(error);
            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
.table-wrap{
    margin-top: 30px;
}
</style>
