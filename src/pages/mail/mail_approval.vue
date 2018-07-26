<template>
    <div>
        <!-- btn -->
        <refresh-btn v-on:refresh="getMailList" tip-message="点击更新邮件列表"></refresh-btn>

        <!-- table -->
        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
            <el-table-column
                prop="username"
                label="操作者">
            </el-table-column>
            <el-table-column
                prop="msg.playerid"
                label="收件人ID">
                <template slot-scope="scope">
                    <el-popover trigger="hover" width="200" placement="top">
                        <div v-if="scope.row.msg.playerid" style="max-height:300px;overflow-y:auto;">
                            <p style="margin-top:0;">玩家ID</p>
                            {{ scope.row.msg.playerid }}
                        </div>
                        <div v-else style="max-height:300px;overflow-y:auto;">
                            <p style="margin-top:0;">服务器ID</p>
                            <span v-for="(item, index) in scope.row.zoneid" :key="index">
                                    {{ item }}服
                            </span>
                        </div>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" class="tag-box">
                                <span v-if="scope.row.msg.playerid">
                                    {{ scope.row.msg.playerid }}
                                </span>
                                <span v-else v-for="(item, index) in scope.row.zoneid" :key="index">
                                    {{ item }}服
                                </span>
                            </el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
                prop="time"
                :formatter="timeFormat"
                label="时间"
                width="180">
            </el-table-column>

            <el-table-column
                prop="msg.title"
                label="邮件标题">
            </el-table-column>

            <el-table-column
                label="道具名">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top" title="">
                        <div v-if="scope.row.msg.arritemsName[0]" style="max-height:300px;overflow-y:auto;">
                            <span class="tip-title">道具名</span><span class="tip-title">道具说明</span>
                            <ul class="tip-box">
                                <li v-for="(item, index) in scope.row.msg.arritemsName" :key="index">
                                    {{ item }}
                                </li>
                            </ul>
                            
                            <ul class="tip-box">
                                <li v-for="(item, index) in scope.row.msg.arritems" :key="index">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            无
                        </div>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium" class="tag-box">
                                <span v-if="scope.row.msg.arritemsName[0]">{{ scope.row.msg.itemsName }}</span>
                                <span v-else>无</span>
                            </el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
                prop="msg.txt"
                label="附件信息"
                class-name="col-txt">
            </el-table-column>

            <el-table-column
                prop="msg.lockgold"
                label="金币">
            </el-table-column>

            <el-table-column
                prop="msg.money"
                label="银币">
            </el-table-column>

            <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    @click="handleOper(scope.$index, scope.row, 1)">发送</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleOper(scope.$index, scope.row, 0)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import refreshBtn from "@/components/refresh";

export default {
    name: 'mail_approval',
    components: {
        'refresh-btn': refreshBtn
    },
    data() {
        return {
            tableData: [],
        }
    },
    created() {
        this.getMailList();
    },
    methods: {
        getMailList() {
            this.$ajax.get('/mail/check').then(response => {
                //
                if (response.data.mails.length > 0) {
                    for(let i = 0, len = response.data.mails.length; i < len; i++) {
                        if(response.data.mails[i].msg.itemsName != undefined) {     // 兼容老版本邮件
                            response.data.mails[i].msg.arritemsName = response.data.mails[i].msg.itemsName.split(" ");
                        } else {
                             response.data.mails[i].msg.arritemsName = []
                        }
                        response.data.mails[i].msg.arritems = response.data.mails[i].msg.items.split(";");
                    }
                }

                console.log("appr_mail:", response);
                this.tableData = response.data.mails;

                this.$message({
                    message: "更新成功",
                    type: 'success'
                })
            })
        },
        timeFormat(value, row, column) {
            return new Date(column).toLocaleString();
        },
        handleOper(index, params, type) {
            let obj = {
                'mailid': params.id,
				'send': type
            }
            console.log("operObj:", obj);
            
            this.$ajax.post("/mail/check", obj).then(response => {
                console.log("feedback:", response);
                
                if (response.data.retcode == "ok") {
                    this.tableData.splice(index, 1);
                    
                    this.$message({
                        message: response.data.retdata,
                        type: 'success'
                    })
                } else {
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

<style lang="scss" scoped>
.tag-box{
    max-width: 80%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.tip-title{
    display: inline-block;
    width: 50%;
}
.tip-box{
    margin: 0;
    padding: 0;
    list-style: none;
    float: left;
    width: 50%;
    height: 100%;
    border-top: 1px solid lightgrey;
    margin-top: 5px;
    padding-top: 5px;
}
.col-txt{
    max-height: 100px;
    overflow: hidden;
}
</style>

