<template>
    <div>
        <!-- form -->
        <el-form :inline="true" :model="formInline" :rules="rules" label-position="right" ref="formInline">
            <el-form-item label="" prop="zoneid">
                <el-select v-model="formInline.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in dbserverlist" :label="item.name" :value="item.zoneid" :key="item.zoneid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="输入玩家ID" prop="charid">
                <el-input v-model.number="formInline.charid" placeholder="输入玩家ID" @keyup.native.enter="onSubmit('formInline')"></el-input>
            </el-form-item>

            <el-form-item label="输入名称" prop="playername">
                <el-input v-model="formInline.playername" placeholder="输入名称" @keyup.native.enter="onSubmit('formInline')"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="onSubmit('formInline')">查询</el-button>
            </el-form-item>
        </el-form>
        
        <!-- Tabs -->
        <el-tabs type="card" v-if="isShow" v-model="tabpanName">
            <el-tab-pane v-if="nameTab_show" name="query">
                <span slot="label"><i class="el-icon-search"></i> 查询列表</span>
                <el-table style="width: 100%" stripe border :data="queryList">
                    <el-table-column prop="RoleID" label="角色ID"></el-table-column>
                    <el-table-column prop="RoleName" label="角色名"></el-table-column>
                    <el-table-column prop="AccountID" label="账号ID"></el-table-column>
                    <el-table-column prop="Level" label="等级"></el-table-column>
                    <el-table-column prop="Profession" label="职业"></el-table-column>
                    <el-table-column prop="Sex" label="性别"></el-table-column>
                    <el-table-column label="查询">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="query_byname(scope.row.RoleID)">查询</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="信息列表" v-if="baseTab_show" name="info">
                <el-tabs tab-position="left">
                    <el-tab-pane label="基础信息">
                        <!-- table -->
                        <el-table :data="basic_info" style="width: 100%" stripe border>
                            <el-table-column prop="zoneid" label="服务器">
                            </el-table-column>
                            <el-table-column prop="roleid" label="ID">
                            </el-table-column>
                            <el-table-column prop="plataccid" label="账号信息">
                            </el-table-column>
                            <el-table-column prop="name" label="角色名">
                            </el-table-column>
                            <el-table-column prop="profession" label="职业">
                            </el-table-column>
                            <el-table-column prop="faction" label="阵营">
                            </el-table-column>
                            <el-table-column prop="sex" label="性别">
                            </el-table-column>
                            <el-table-column prop="level" label="等级">
                            </el-table-column>
                            <el-table-column prop="exp" label="经验">
                            </el-table-column>
                            <el-table-column prop="money" label="银币">
                            </el-table-column>
                            <el-table-column prop="lockgold" label="金币">
                            </el-table-column>
                            <el-table-column prop="gold" label="勾玉">
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="背包信息">
                        <el-table :data="backpack_info" style="width: 100%" stripe border>
                            <el-table-column prop="guid" label="唯一ID">
                            </el-table-column>
                            <el-table-column prop="itemid" label="物品ID">
                            </el-table-column>
                            <el-table-column prop="itemnum" label="数量">
                            </el-table-column>
                            <el-table-column prop="status" label="状态">
                            </el-table-column>
                            <el-table-column label="技能ID列表">
                                <template slot-scope="scope">
                                    <el-popover
                                    placement="right"
                                    trigger="hover">
                                        <el-table :data="scope.row.skill">
                                            <el-table-column width="100" property="skillid" label="技能id" align="center"></el-table-column>
                                            <el-table-column width="100" property="skilllevel" label="技能等级" align="center"></el-table-column>
                                        </el-table>
                                        <el-button slot="reference" class="info-el-button">
                                            <span v-if="scope.row.skill.length > 0" v-for="(item, index) in scope.row.skill" :key="index">
                                                {{ item.skillid }}:{{ item.skilllevel }}
                                            </span>
                                            <span v-if="scope.row.skill.length == 0">
                                                暂无数据
                                            </span>
                                        </el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性">
                                <template slot-scope="scope">
                                    <el-popover
                                    placement="left"
                                    trigger="hover">
                                        <el-table :data="scope.row.attr">
                                            <el-table-column width="100" property="attrtype" label="属性类型" align="center"></el-table-column>
                                            <el-table-column width="100" property="attrvalue" label="属性值" align="center"></el-table-column>
                                            <el-table-column width="100" property="equipqulity" label="装备品质" align="center"></el-table-column>
                                        </el-table>
                                        <el-button slot="reference" class="info-el-button">
                                            <span v-if="scope.row.attr.length > 0" v-for="(item, index) in scope.row.attr" :key="index" >
                                                {{ item.attrtype }}:{{ item.attrvalue }}:{{ item.equipqulity }}
                                            </span>
                                            <span v-if="scope.row.attr.length == 0">
                                                暂无数据
                                            </span>
                                        </el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="部位信息">
                        <el-table :data="part_info" style="width: 100%" stripe border>
                            <el-table-column prop="PartType" label="部位ID">
                            </el-table-column>
                            <el-table-column prop="Strengthen" label="强化等级">
                            </el-table-column>
                            <el-table-column prop="StarLv" label="升星">
                            </el-table-column>
                            <el-table-column prop="star" label="存储升星点数">
                            </el-table-column>
                            <el-table-column prop="StarPoint" label="当前部位升星点数">
                            </el-table-column>
                            <el-table-column prop="Gems" label="宝石列表">
                                <template slot-scope="scope">
                                    {{ scope.row.Gems }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="装备信息">
                        <el-table :data="equipment_info" style="width: 100%" stripe border>
                            <el-table-column prop="guid" label="唯一ID">
                            </el-table-column>
                            <el-table-column prop="itemid" label="物品ID">
                            </el-table-column>
                            <el-table-column prop="itemnum" label="数量">
                            </el-table-column>
                            <el-table-column prop="status" label="状态">
                            </el-table-column>
                            <el-table-column label="技能ID列表">
                                <template slot-scope="scope">
                                    <el-popover
                                    placement="right"
                                    trigger="hover">
                                        <el-table :data="scope.row.skill">
                                            <el-table-column width="100" property="skillid" label="技能id" align="center"></el-table-column>
                                            <el-table-column width="100" property="skilllevel" label="技能等级" align="center"></el-table-column>
                                        </el-table>
                                        <el-button slot="reference" class="info-el-button">
                                            <span v-if="scope.row.skill.length > 0" v-for="(item, index) in scope.row.skill" :key="index">
                                                {{ item.skillid }}:{{ item.skilllevel }}
                                            </span>
                                            <span v-if="scope.row.skill.length == 0">
                                                暂无数据
                                            </span>
                                        </el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column label="属性">
                                <template slot-scope="scope">
                                    <el-popover
                                    placement="left"
                                    trigger="hover">
                                        <el-table :data="scope.row.attr">
                                            <el-table-column width="100" property="attrtype" label="属性类型" align="center"></el-table-column>
                                            <el-table-column width="100" property="attrvalue" label="属性值" align="center"></el-table-column>
                                            <el-table-column width="100" property="equipqulity" label="装备品质" align="center"></el-table-column>
                                        </el-table>
                                        <el-button slot="reference" class="info-el-button">
                                            <span v-if="scope.row.attr.length > 0" v-for="(item, index) in scope.row.attr" :key="index" >
                                                {{ item.attrtype }}:{{ item.attrvalue }}:{{ item.equipqulity }}
                                            </span>
                                            <span v-if="scope.row.attr.length == 0">
                                                暂无数据
                                            </span>
                                        </el-button>
                                    </el-popover>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="时装信息">
                        <el-table :data="fashion_info" style="width: 100%" stripe border>
                            <el-table-column prop="onlyid" label="时装唯一ID">
                            </el-table-column>
                            <el-table-column prop="itemid" label="时装ID">
                            </el-table-column>
                            <el-table-column  label="染色">
                                <template slot-scope="scope">
                                    <span v-for="(item, index) in scope.row.colors" :key="index">{{ item }}, </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name: 'query_players',
    data() {
        var validate_charid = (rule, value, callback) => {
            
            if (this.formInline.playername == '' && value == '') {
                callback(new Error('ID和名称至少输入一个'));
            } else {
                 if (value !='' && !Number.isInteger(value)) {
                    callback(new Error('ID必须是数字'));
                }
                callback();
            }
        }
      return {
        // 表单验证
        rules: {
            zoneid: [
                {  required: true, message: '请选择服务器', trigger:'change' }
            ],
            charid: [
                { validator: validate_charid, trigger: 'blur' }
            ]
        },

        baseTab_show: false,
        nameTab_show: false,
        tabpanName: 'info',
        formInline: {
          zoneid: '',
          charid: '',
          playername: ''
        },
        zoneid: '',
        dbserverlist: [],
        // table
        queryList: [],
        basic_info: [],
        backpack_info: [],
        part_info: [],
        equipment_info: [],
        fashion_info: []
      }
    },
    methods: {
      onSubmit(formName) {
        console.log("formInline:", this.formInline);

        this.$refs[formName].validate((valid) => {
            if (valid) {
                this.getInfo(this.formInline)
            } else {
                return false;
            }
        })

      },
      query_byname(id) {
        let obj = {
            'charid': id,
            'zoneid': this.zoneid,
        }
        this.getInfo(obj, "byname");
      },
      getInfo(obj) {
            let _arguments = arguments;
            let _this = this;
            
            this.$ajax.post("/player/playerinfo", obj).then(function(response) {
                console.log("playerInfo:", response);

                if (response.data.err != '') {  // err提示
                    _this.$notify({
                        title: '警告',
                        message: response.data.err,
                        type: 'warning',
                        position: 'top-right'
                    });
                    return;
                }
                
                if (response.data.byid) {    // 通过id查询
                    
                    if (_arguments[1] == "byname") {
                        _this.nameTab_show = true;
                        _this.baseTab_show = true;
                        _this.tabpanName = 'info'
                        
                    } else {
                        
                        _this.nameTab_show = false;
                        _this.baseTab_show = true;
                        _this.tabpanName = 'info';
                    }

                    response.data.base['plataccid'] = response.data.plataccid   // 用于我们内部登录玩家账号的字符串
                    _this.basic_info = [response.data.base];
                    _this.backpack_info = response.data.bagdata;

                    for (let i = 0, len = response.data.parts.PartData.length; i < len; i++) {
                        response.data.parts.PartData[i].star = response.data.parts.star;
                    }
                    _this.part_info = response.data.parts.PartData;
                    _this.equipment_info = response.data.equips;
                    _this.fashion_info = response.data.fashioninfo.datas;
                }

                if (response.data.byname) {     // 通过name查询

                    _this.tabpanName = 'query';
                    _this.baseTab_show = false;
                    _this.nameTab_show = true;

                    _this.queryList = response.data.data;
                    _this.zoneid = response.data.zoneid;
                }
                
            }).catch(function(error) {
                console.log(error);
            })
      }
    },
    computed: {
        isShow() {
            if (this.baseTab_show == false && this.nameTab_show == false) {
                return false;
            } else {
                return true;
            }
        }
    },
    created() {
        // 获取dbserverlsit
        this.$ajax.get("/dbserverlist").then((response) => {
            console.log('dbserverList:',response);
            this.dbserverlist = response.data;
        })
    }
  }
</script>

<style lang="scss" scoped>

.el-tabs{
    margin-top: 30px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.info-el-button{
    max-width:100%;
    overflow:hidden; 
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

