<template>
    <div>
        <p style="display:none;">{{ route }}</p>
        <!-- btn -->
        <refresh-btn @refresh="ref_getMerInfo" tip-message="刷新"></refresh-btn>
        
        <el-row>
            <el-col :span="7" :offset="1"> 
                <el-steps :active="active" direction="vertical" 
                space="100px"
                finish-status="success"
                process-status="">
                    <el-step title="步骤 1" :description="step_titles[0]"></el-step>
                    <el-step title="步骤 2" :description="step_titles[1]"></el-step>
                    <el-step title="步骤 3" :description="step_titles[2]"></el-step>
                    <el-step title="步骤 4" :description="step_titles[3]"></el-step>
                    <el-step title="结束" :description="step_titles[4]"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="16">

                <el-card class="box-card" v-for="(item, index) in infos" :key="index">
                    <div slot="header" class="clearfix">
                        <span>{{ box_titles[index] }}</span>
                        <span style="float:right;" v-show="index < 4">{{ infos.step }} / {{ infos.length }}</span>
                    </div>
                    <div v-if="index < 4">
                        <p v-for="(_item, _index) in item.ret" :key="_index">{{ _item }}</p>
                    </div>
                    <div v-if="index >= 4">
                        <p>{{ item.end }}</p>
                    </div>
                </el-card>

            </el-col>
        </el-row>
    </div>
</template>

<script>
import refreshBtn from "@/components/refresh";

export default {
    name: 'merging',
    components: {
        'refresh-btn': refreshBtn
    },
    data() {
        return {
            timer: '',
            active: 0,
            infos: [],
            step_titles : ["检查数据库合法性","创建目标数据库数据结构"," 导入主数据库数据","被合并数据库数据接入","结束"],
            box_titles: ["步骤一", "步骤二", "步骤三", "步骤四", "结束"]
        }
    },
    mounted() {
        this.getMergingInfo();
    },
    methods: {
        getMergingInfo() {
            this.timer = setInterval(() => {
                this.$ajax.get("/service/merge").then(response => {
                    console.log(response);
                    if (response.data.infos) {
                        this.infos = response.data.infos;
                    }
                }).catch(error => {
                    console.log(error);
                    clearInterval(this.timer);

                    this.$notify({
                        title: '错误',
                        message: error.response.data,
                        type: 'error'
                    });
                })
            }, 1000)
        },
        ref_getMerInfo() {
            this.infos = [];
            clearInterval(this.timer);
            this.getMergingInfo();
        }
    },
    watch: {
        infos(val, oldval) {
            console.log(val.length);
            
            if (val.length >= 5) {
                this.active = 5;
                clearInterval(this.timer);
            } else {
                this.active = val.length - 1;
            }
        }
    },
    computed: {
        route() {
            if (this.$route.path.replace('/','') == "merging") {
                let breadcrumb_title = ["iconfont icon-fuwuqi", "服务器", "合服中"]
                this.$store.commit("set_breadcrumb_title", breadcrumb_title);
            }
        }
    },
     beforeRouteLeave(to, from, next) {
        if (to.path == "/login") {
            clearInterval(this.timer);
        }
        next();
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
    clear: both;
}

.box-card {
    width: 580px;
    margin-bottom: 10px;
}
</style>


