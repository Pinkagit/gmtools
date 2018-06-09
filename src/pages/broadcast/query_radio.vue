<template>
    <div>
        <!-- btn -->
        <refresh-btn tip-message="点击更新广播列表" @refresh="get_radio_table"></refresh-btn>
        <!-- table -->
        <el-table
        :data="tableData"
        stripe
        style="width:100%;">
            <el-table-column prop="index" label="Index"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="channel" label="频道"></el-table-column>
            <el-table-column prop="starttime" label="开始时间"></el-table-column>
            <el-table-column prop="endtime" label="结束时间"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            
            <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="warning"
                    @click="SetOpen(scope.$index, scope.row.index)"
                    v-if="scope.row.isopen">关闭</el-button>
                    
                    <el-button
                    size="mini"
                    type="primary"
                    @click="SetOpen(scope.$index, scope.row.index)"
                    v-if="!scope.row.isopen">开启</el-button>

                    <el-button
                    size="mini"
                    type="danger"
                    @click="DelBor(scope.$index, scope.row.index)"
                    v-if="!scope.row.isopen">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import refreshBtn from "@/components/refresh";

export default {
    components: {
        'refresh-btn': refreshBtn
    },
    data() {
        return {
            tableData: []
        }
    },
    created() {
        this.get_radio_table();
    },
    methods: {
        get_radio_table() {
            this.$ajax.post("/api/broadcast").then(response => {
                console.log("radio_table", response);
                this.tableData = response.data.data;
            })
        },
        SetOpen(index, param_index) {
            let obj = {
                'index': param_index
            }

            this.$ajax.post('/api/broadcast/setopen', obj).then(response => {
                console.log("feedback", response);
                this.$message({
                    message: "操作成功",
                    type: 'success'
                })
                this.get_radio_table();
                
            }).catch(error => {
                console.log(error);

                this.$message({
                    message: "Err",
                    type: 'error'
                })
            })
        },
        DelBor(index, param_index) {
            let obj = {
                'index': param_index
            }

            this.$ajax.post("/api/broadcast/del", obj).then(response => {
                console.log("feedback", response);
                this.$message({
                    message: "操作成功",
                    type: 'success'
                })
                this.get_radio_table();
                
            }).catch(error => {
                console.log(error);
                this.$message({
                    message: "Err",
                    type: 'error'
                })
            })
        }
    }
}
</script>

