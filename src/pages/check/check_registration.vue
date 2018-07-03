<template>
    <div>
        <!-- btn -->
        <refresh-btn v-on:refresh="getInfo" tip-message="点击更新列表"></refresh-btn>
        <!-- table -->
        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
            <el-table-column 
                prop="username"
                label="用户名">
            </el-table-column>

            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>

            <el-table-column
                :formatter="depFormat"
                prop="department"
                label="部门">
            </el-table-column>

            <el-table-column
                prop="privilege"
                label="当前权限">
            </el-table-column>

            <el-table-column
                width="280"
                label="设置权限">
                <template slot-scope="scope">
                    <el-select size="mini" v-model="arrPri[scope.$index]" placeholder="请选择">
                        <el-option
                        v-if="privilege < item.pri_value"
                        v-for="item in op_list"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                        </el-option>
                    </el-select>

                    <el-button
                        size="mini"
                        type="primary"
                    @click="handleOper(scope.row, scope.$index)">提交</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import refreshBtn from "@/components/refresh";

export default {
    name: 'check_registration',
    components: {
        'refresh-btn': refreshBtn
    },
    data() {
        return {
            tableData: [],
            privilege: "",
            arrPri: [],
            op_list: []
        }
    },
    created() {
        this.getInfo();

        this.$ajax.get("/static/index.json").then(response => {
            console.log("index.json", response);

            this.op_list = response.data.depList;
        })
        
    },
    methods: {
        getInfo() {
            this.$ajax.get("/check").then(response => {
                console.log("infos", response);
                
                this.privilege = response.data.privilege;
                this.tableData = response.data.userlist;

                this.$message({
                    message: "更新成功",
                    type: 'success'
                })
                
            }).catch(error => {
                console.log(error);
            })
        },
        handleOper(params, index) {
            console.log(index);
            
            let obj = {
                username: params.username,
                privilege: this.arrPri[index] || 0
            }
            console.log("obj", obj);

            this.$ajax.post("/check", obj).then(response => {
                console.log("feedback", response);

                if (response.data.username) {
                    this.$message({
                        message: response.data.err,
                        type: 'success'
                    })
                    this.tableData.splice(index, 1);
                } else {
                    this.$message({
                        message: response.data.err,
                        type: 'error'
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        },
        depFormat(value, row, column) {
            switch (column) {
                case "2":
                    return "后台";
                case "3":
                    return '运营';
                case "4":
                    return '运维';
                case "5":
                    return '客服';
                default:
                    break;
            }            
        }
    }
}
</script>
