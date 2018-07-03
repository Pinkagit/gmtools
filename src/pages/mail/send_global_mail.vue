<template>
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="formData.zoneid" @change="handleChecked">
                    <el-checkbox 
                    v-for="(item, index) in serverList" 
                    :label="item.zoneid" 
                    :key="index">
                        {{item.servername ? item.servername : item.zoneid + '区'}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label-width="0">
                <el-col :span="12">
                    <el-form-item label="银币" prop="money">
                        <el-input v-model.number="formData.money"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                     <el-form-item label="金币" prop="lockgold">
                        <el-input v-model.number="formData.lockgold"></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="邮件标题" prop="title">
                <el-col :span="12">
                    <el-input v-model.number="formData.title" placeholder="系统奖励"></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="道具列表" prop="items">
                <el-col :span="24">
                    <el-input v-model="formData.items" placeholder="1001:1;1002:1" @input="getItemsName"></el-input>
                    <!-- 道具中文化 -->
                    <items-name :itemList="itemList" :isErr="isErr"></items-name>
                </el-col>
            </el-form-item>
            
            <el-form-item label="邮件内容" prop="content">
                <el-input type="textarea" autosize v-model="formData.content" placeholder="恭喜游戏上线..."></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
import itemsName from "@/components/itemsName";

export default {
    name:'send_global_mail',
    components: {
        "items-name":itemsName
    },
    data() {
        return {
            checkAll: false,
            isIndeterminate: false,
            formData: {
                zoneid: [],
                money: 0,
                lockgold: 0,
                title: '',
                items: '',
                content: '',
                itemsName: ''
            },
            serverList: [],
            itemList: [],
            isErr: [],
            //
            rules: {
                zoneid: [
                    { type:'array', required: true, message: '请至少选择一个服务器', trigger: 'change' }
                ],
                lockgold: [
                    { type: 'number', message: '金币必须为数字', trigger:'blur' }
                ],
                money: [
                    { type: 'number', message: '银币必须为数字', trigger:'blur' }
                ],
                 title: [
                    { required: true, message: '请输入邮件标题', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleAllChange(value) {
            if (value) {
                let zoneidList = []
                for(let i = 0, len = this.serverList.length; i < len; i++) {
                    zoneidList.push(this.serverList[i].zoneid)
                }
                this.formData.zoneid = zoneidList;
                this.isIndeterminate = false;
            } else {
                this.formData.zoneid = []
            }
        },
        handleChecked(value) {
            this.checkAll = value.length == this.serverList.length;
            this.isIndeterminate = value.length > 0 && value.length < this.serverList.length;
        },
        getItemsName() {
            if(this.formData.items.indexOf(":") != "-1"){
                var arr1 = this.formData.items.split(";");

                var proItem = [];
                var proNum = [];

                for (let i = 0, j = arr1.length; i < j; i++) {
                    var arr2 = arr1[i].split(":");
                    // console.log("arr2",arr2);
                    
                    if (arr2[0] != "") {
                        proItem[i] = arr2[0]
                    }
                    if (arr2[1] != "") {
                        proNum[i] = parseInt(arr2[1])
                    }
                }
                // console.log("proItem", proItem);
                // console.log("proNum", proNum);
                
                var proData = {
                    "proItem": proItem
                }

                this.$ajax.post('/quitemlist', proData).then(response => {
                    console.log("quitemList:", response);

                    this.itemList = response.data.itemlist;
                    this.isErr = [];
                    
                    for (let i = 0, len = response.data.itemlist.length; i < len; i++) {
						var oNum = parseInt(response.data.itemlist[i].num);
						if (proNum[i]) {
							if (oNum < proNum[i]) {
                                this.isErr.push(i)
							} 
						} else {
                            this.isErr.push(i)
						}
					}
                })
                
            } else if(this.formData.items == "") {
                this.itemList = [];
            }
        },
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.isErr.length > 0) {
                        this.$notify({
                            title: '警告',
                            message: '道具列表参数出错',
                            type: 'warning'
                        });
                    } else {
                        this.sendGlobal();
                    }
                } else {
                    return false;
                }
            })
        },
        sendGlobal() {

            let itemsName = '';
            for(let i = 0, len = this.itemList.length; i < len; i++) {
                itemsName += this.itemList[i].name + " ";
            }
            this.formData.itemsName = itemsName;
            
            console.log("formData", this.formData);

            this.$ajax.post('/mail/sendglobalmail', this.formData).then(response => {
                console.log("feedback", response);

                if (response.data.retcode != "error") {
                    this.$notify({
                        title: '成功',
                        message: response.data.retdesc,
                        position: 'bottom-right',
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        position: 'bottom-right',
                        type: 'error'
                    });
                }
            }).catch(error => {
                console.log(error);
            })
        }
    },
    created() {
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
    }
}
</script>

