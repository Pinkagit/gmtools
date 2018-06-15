<template>
    <div>
        <el-form ref="form" :inline="true" :rules="rules" :model="formData" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-select v-model="formData.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                 <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- table -->
        <el-table style="width: 100%" stripe border :data="tableData" v-loading="loading">
            <el-table-column
                prop="key"
                label="key">
            </el-table-column>
            <el-table-column
                prop="value.title"
                label="标题">
            </el-table-column>
            <el-table-column
                prop="value.createtime"
                label="创建时间">
            </el-table-column>
            <el-table-column
                prop="value.content"
                label="内容">
            </el-table-column>
            <el-table-column
                prop="value.money"
                label="银币">
            </el-table-column>
            <el-table-column
                prop="value.lockgold"
                label="金币">
            </el-table-column>
            <el-table-column
                prop="value.items"
                label="物品">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="toDel(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
                
    </div>
</template>

<script>
export default {
    data() {
        return {
            serverList: [],
            formData: {
                zoneid: '',
                charid: 0
            },
            tableData: [],
            loading: false,

            //
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.queryMail();
                } else {
                    return false;
                }
            })
        },
        toDel(params, index) {
            let obj = {
                'mailindex': params.key,
                'zoneid': this.formData.zoneid
            }

            this.$ajax.post("/mail/delglobalmail", obj).then(response => {
                console.log("feedback:", response);
                
                if (response.data.retcode == "ok") {
                    this.tableData.splice(index, 1);
                    this.$message({
                        message: '删除成功！',
                        type: 'success'
                    })
                }
            })
            
        },
        queryMail() {
            console.log("formData", this.formData);

            this.loading = true;

            this.$ajax.post("/mail/globalmail", this.formData, { timeout: 10000 }).then(response => {
                console.log("globalmail:", response);

                if (response.data.retcode == 'error') {
                    this.$notify.error({
                        title: '错误',
                        message: response.data.retdesc
                    });
                    this.loading = false;
                    return false;
                }
                console.log("then");
                
                if (response.data.retdata.mails) {
                    for(let i = 0, len = response.data.retdata.mails.length; i < len; i++) {
                        let createtime = new Date();
                        createtime.setTime(response.data.retdata.mails[i].value.createtime * 1000);
                        response.data.retdata.mails[i].value.createtime = createtime.toLocaleString();
                    }

                    this.tableData = response.data.retdata.mails;
                } 
                this.loading = false;
                
            }).catch(error => {
                console.log(error);
                this.loading = false;

                this.$notify({
                    title: '错误',
                    message: error.response.statusText,
                    type: 'error'
                });
            })
        }
    },
    created() {
        // 获取服务器列表
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    }
}
</script>

<style lang="scss" scoped>

</style>

