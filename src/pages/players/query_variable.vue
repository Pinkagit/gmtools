<template>
    <div>
        <el-tabs tab-position="left" style="height: 200px;">
            <el-tab-pane label="服务器变量">
                <el-form :inline="true" ref="form" :model="formData.serverVar" :rules="rules" label-position="right" label-width="100px">
                    <el-form-item label="选择服务器" prop="zoneid">
                         <el-select v-model="formData.serverVar.zoneid" placeholder="选择服务器">
                            <el-option v-for="item in dbserverlist" :label="item.name" :value="item.zoneid" :key="item.zoneid"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="server_onSubmit()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            
            <el-tab-pane label="玩家变量">
                <el-form :inline="true" ref="form" :model="formData.playerVar" :rules="rules" label-position="right" label-width="100px">
                    <el-form-item label="选择服务器" prop="zoneid">
                         <el-select v-model="formData.playerVar.zoneid" placeholder="选择服务器">
                            <el-option v-for="item in dbserverlist" :label="item.name" :value="item.zoneid" :key="item.zoneid"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="输入玩家ID" prop="charid" >
                        <el-input v-model.number="formData.playerVar.charid" placeholder="输入玩家ID"></el-input>
                    </el-form-item>

                    <el-form-item label="输入玩家变量" prop="charid" >
                        <el-input v-model.number="formData.playerVar.variable" placeholder="输入玩家变量"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" @click="player_onSubmit()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data(){
        return{
            formData: {
                serverVar: {
                    zoneid: ''
                },
                playerVar: {
                    zoneid: '',
                    variable: '',
                    charid: ''
                }
            },
            rules: {

            },
            dbserverlist: []
        }
    },
    created() {
        // 获取dbserverlsit
        this.$ajax.get("/dbserverlist").then((response) => {
            console.log('dbserverList:',response);
            this.dbserverlist = response.data;
        })
    },
    methods: {
        server_onSubmit() {
            console.log("serverVar:", this.formData.serverVar)
        },
        player_onSubmit() {
            console.log("playerVar:", this.formData.playerVar)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

