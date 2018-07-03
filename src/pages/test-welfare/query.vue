<template>
    <div class="wrap">
        <el-col :span="9">
            <div class="form-box">
                <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
                    <el-form-item label="平台账号" prop="account">
                        <el-col :span="12">
                            <el-input v-model="formData.account"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="平台ID" prop="plat">
                        <el-col :span="12">
                            <el-input v-model="formData.plat"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>

        <el-col :span="15">
            <transition name="slide-fade">
                <el-card class="box-card" v-show="tableData.length">
                    <div class="code-box">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="account" label="账号"></el-table-column>

                            <el-table-column prop="plat" label="平台"></el-table-column>

                            <el-table-column prop="chargeuse" label="充值领取" :formatter="useFormat"></el-table-column>

                            <el-table-column prop="betause" label="等级礼包" :formatter="useFormat"></el-table-column>

                            <el-table-column prop="gold" label="充值金额"></el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </transition>
        </el-col>
    </div>
</template>

<script>
export default {
    name: 'query_tw',
    data() {
        return {
            formData: {
                account: '1',
                plat: '1'
            },
            rules: {
            },
            tableData: []
        }
    },
    methods: {
        onSubmit() {
            console.log("formData", this.formData);

            this.$ajax.post("/betawelfare/", this.formData).then(response => {
                console.log("betawelfare", response);
                let t = [];
                t[0] = response.data.data;
                this.tableData = t;
                
                this.$message({
                    message: "查询成功",
                    type: 'success'
                })
                
            }).catch(error => {
                console.log(error);
            })
            
        },
        useFormat(value, row, column) {
            return column == 0 ? '可以领取' : (column == 2 ? '已领取' : '不存在');
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
.code-box{
    max-height: 170px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>


