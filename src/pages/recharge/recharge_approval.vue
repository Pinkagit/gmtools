<template>
    <div>
        <!-- btn -->
        <refresh-btn tip-message="点击更新充值列表" @refresh="getRechargeList"></refresh-btn>
        <!-- table -->
        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
            <el-table-column prop="username" label="操作者"></el-table-column>
            <el-table-column prop="time" width="180" label="操作时间"></el-table-column>
            <el-table-column prop="msg.roleid" label="收到人ID"></el-table-column>
            <el-table-column prop="serverid" label="服务器ID"></el-table-column>
            <el-table-column prop="msg.rechargeid" label="充值ID"></el-table-column>
            <el-table-column prop="rechargename" label="充值说明"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleOper(scope.$index, scope.row, 1)">通过</el-button>
                    <el-button type="danger" size="mini" @click="handleOper(scope.$index, scope.row, 0)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import refreshBtn from "@/components/refresh";

export default {
    components: {
        "refresh-btn": refreshBtn
    },
    data() {
        return {
            tableData: []
        }
    },
    created() {
        this.getRechargeList();
    },
    methods: {
        getRechargeList() {
            this.$ajax.get("/freecharge/check").then(response => {
                console.log("rechargeLsit", response);
                
                this.tableData = response.data.recharge;

                this.$message({
                    message: "更新成功",
                    type: 'success'
                })
            })
        },
        handleOper(index, params, type) {
            let obj = {
                'chargeid': params.id,
                'send': type
            }

            console.log("operObj", obj);
            
            this.$ajax.post("/freecharge/check", obj).then(response => {
                console.log("feedback", response);

                if (response.data.result == 1) {
                    this.tableData.splice(index, 1);
                    
                    this.$message({
                        message: "操作成功",
                        type: 'success'
                    })
                } else if(response.data.result == 0) {
                    this.$message({
                        message: "操作失败",
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
