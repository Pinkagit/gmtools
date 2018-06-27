<template>
    <div>
        <el-form ref="form" :inline="true" :rules="rules" :model="formData" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="serverid">
                <el-select v-model="formData.serverid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-form-item label="玩家ID" prop="playerid">
                    <el-input v-model.number="formData.playerid"></el-input>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>

        <!-- table -->
        <el-table style="width: 100%" stripe border :data="tableData" v-loading="loading">
            <el-table-column
                align="center"
                prop="playerid"
                label="玩家ID">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.status" type="primary" @click="toDel(scope.row, scope.$index)">踢出</el-button>
                    <span v-else>不在</span>
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
                serverid: '',
                playerid: ''
            },
            serverList: [],
            tableData: [],
            rules: {},
            loading: false
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
            this.getList();
        },
        toDel(params, index) {
            let delobj = {
                serverid: this.formData.serverid,
                playerid: params.playerid
            }

            console.log("delobj", delobj);

            this.$ajax.post("/service/delprison", delobj).then(response => {
                console.log("feedback:", response);

                if (response.data.retcode == "error") {
                    this.$message({
                        message: response.data.retdesc,
                        type: 'error'
                    })
                    return false;
                }
                this.tableData.splice(index, 1);
                
            }).catch(error => {
                console.log(error);
                
                this.$notify({
                    title: '错误',
                    message: error.response.statusText,
                    type: 'error'
                });
            })
        },
        getList() {
            this.loading = true;
            
            let obj = {
                serverid: this.formData.serverid || 0,
                playerid: this.formData.playerid || 0
            }
            
            console.log("obj", obj);

            this.$ajax.post("/service/prison", obj, { timeout: 15000 }).then(response => {
                console.log("received:", response);
                
                this.tableData = response.data.retdata.prisons;

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
    }
}
</script>

