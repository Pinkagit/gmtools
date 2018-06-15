<template>
    <div>
        <el-row>
            <el-col style="margin-bottom:15px;">
                <el-button style="float: right;" size="small" type="primary" @click="clearMerge">清空配置</el-button>

                <el-button style="float: right;margin-right:15px;" size="small" type="primary" @click="startMerge">开始</el-button>
                
            </el-col>
        </el-row>
        <el-row :gutter="20">

            <el-col :span="8" v-for="(item, index) in formData" :key="index">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>{{ item.title }}</span>
                        <el-button style="float: right;" size="mini" type="primary" @click="TestDatabase(item, index)">测试</el-button>
                    </div>
                    <div>
                        <!-- el-alert -->
                        <transition name="fade">
                            <el-alert :title="item.alert_title" :type="item.alert_tip" v-show="item.alert_title" @close="alert_close(item)" show-icon>
                            </el-alert>
                        </transition>
                        <!-- form -->
                        <el-form ref="form" :model="item.params" :rules="rules" label-position="right" label-width="100px">
                            
                            <el-form-item label="服务器名" prop="servername">
                                <el-col :lg="18" :sm="24">
                                    <el-input size="small " v-model="item.params.servername"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item label="数据库" prop="database">
                                <el-col :lg="18" :sm="24">
                                    <el-input size="small" v-model="item.params.database"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item label="host" prop="host">
                                <el-col :lg="18" :sm="24">
                                    <el-input size="small" v-model="item.params.host"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item label="user" prop="user">
                                <el-col :lg="18" :sm="24">
                                    <el-input size="small" v-model="item.params.user"></el-input>
                                </el-col>
                            </el-form-item>

                            <el-form-item label="密码" prop="password">
                                <el-col :lg="18" :sm="24">
                                    <el-input size="small" v-model="item.params.password"></el-input>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </el-col>

        </el-row>
    </div>
</template>

<script>
import checkboxServer from "@/components/checkbox-server";

export default {
    components: {
        'checkbox-server': checkboxServer
    },
    data() {
        return {
            rules: {
            },

            formData: [
                {   
                    title: "主数据库 (目标数据库的库表结构以此为准)",
                    alert_title: '',
                    alert_tip: 'error',
                    params: {
                        type: 1,
                        servername: "test_1",
                        database: 'rockgame',
                        host: '127.0.0.1:3306',
                        user: 'root',
                        password: '123456'
                    }
                }, {
                    title: "被合并数据库",
                    alert_title: '',
                    alert_tip: 'error',
                    params: {
                         type: 2,
                        servername: "test_2",
                        database: 'rockgame2',
                        host: '127.0.0.1:3306',
                        user: 'root',
                        password: '123456'
                    }
                }, {
                    title: "目标数据库",
                    alert_title: '',
                    alert_tip: 'error',
                    params: {
                         type: 3,
                        servername: "test_3",
                        database: 'hefu',
                        host: '127.0.0.1:3306',
                        user: 'root',
                        password: '123456'
                    }
                }
            ]
        }
    },
    methods: {
        TestDatabase(params, index) {
            console.log("params", params);

            this.$ajax.post("/service/merge", params.params).then(response => {
                console.log("feedback", response);

                if (response.data.err != "成功") {
                    params.alert_title = response.data.err;
                    
                    params.alert_tip = "error";
                } else {
                    params.alert_title = response.data.err;
                    params.alert_tip = "success";
                }
            }).catch(error => {
                console.log(error);
            })
        },
        alert_close(params) {
            params.alert_title = "";
        },
        clearMerge() {
            let obj = {
                type: 5
            }
            this.$ajax.post("/service/merge", obj).then(response => {
                console.log("feedback", response);

                if (response.data.ret == "成功") {
                    this.$message({
                        message: response.data.ret,
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: "Err",
                        type: 'error'
                    });
                }
            }).catch(error => {
                console.log(error);
            })
        },
        startMerge() {
            let obj = {
                type: 4
            }
            //-------------------------------------------------------------------------*
            // this.$router.push({ path: '/merging' });
            
            this.$ajax.post("/service/merge", obj).then(response => {
                console.log("feedback", response);

                if (response.data.url == "merging") {
                    this.$router.push({ path: response.data.url })
                }
                
            }).catch(error => {
                console.log(error);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both
}
.box-card{
    min-width: 200px;
}

/* transition fade */
.fade-enter-active, .fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
