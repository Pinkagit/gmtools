<template>
<div class="wrap-box">
    <div class="form-box">
        <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">
            <el-form-item label="选择服务器" prop="zoneid">
                <el-select v-model="formData.zoneid" placeholder="选择服务器">
                    <el-option v-for="item in serverList" :key="item.zoneid" :label="item.servername ? item.servername : item.zoneid + '区'" :value="item.zoneid"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label-width="0">
                <el-col :span="12">
                    <el-form-item label="输入玩家ID" prop="charid">
                        <el-input v-model="formData.charid" placeholder="输入玩家ID"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="上传玩家ID">
                        <el-upload
                            ref="upload"
                            action="/mail/sendmail"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-change="getFile"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            :limit="1"
                            :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip" v-show="tip_isShow">点击文件可预览</div>
                        </el-upload>
                    </el-form-item>                    
                </el-col>
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
    <div class="preview-box" v-show="pre_isShow">
        {{perview}}
    </div>
</div>
</template>

<script>
import itemsName from "@/components/itemsName";

export default {
    name: 'send_personal_mail',
    components: {
        "items-name":itemsName
    },
    data() {
        return {
            perview:"",
            tip_isShow: false,
            pre_isShow: false,
            isErr: [],
            itemList: [],
            serverList: [],
            formData: {
                zoneid: '',
                charid: '',
                money: 0,
                lockgold: 0,
                title:'',
                items: '',
                content: ''
            },
            fileList: [],
            uploadForm: null,
            files: null,
            //
            rules: {
                zoneid: [
                    { required: true, message: '请选择服务器', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '请输入邮件标题', trigger: 'blur' }
                ],
                lockgold: [
                    { type: 'number', message: '金币必须为数字', trigger:'blur' }
                ],
                money: [
                    { type: 'number', message: '银币必须为数字', trigger:'blur' }
                ]
            }

        }
    },
    methods: {
        sendPersonal() {
            console.log("formData", this.formData);

            this.uploadForm.set('zoneid', this.formData.zoneid)
            this.uploadForm.set('charid', this.formData.charid)
            this.uploadForm.set('money', this.formData.money)
            this.uploadForm.set('lockgold', this.formData.lockgold)
            this.uploadForm.set('title', this.formData.title)
            this.uploadForm.set('items', this.formData.items)
            this.uploadForm.set('content', this.formData.content)
            //
            let itemsName = '';
            for(let i = 0, len = this.itemList.length; i < len; i++) {
                itemsName += this.itemList[i].name + " ";
            }
            this.uploadForm.set('itemsName', itemsName)
            

           /*  // 遍历
            for(var pair of this.uploadForm.entries()) {
                console.log(pair[0]+ ':'+ pair[1]); 
            } */
            
            this.$ajax.post('/mail/sendmail', this.uploadForm).then(response => {
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
                        this.sendPersonal();
                    }
                    
                } else {
                    return false;
                }
            })
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

                        if (oNum != -1) {
                            if (proNum[i]) {
                                if (oNum < proNum[i]) {
                                    this.isErr.push(i)
                                } 
                            } else {
                                this.isErr.push(i)
                            }
                        }
					}
                })
                
            } else if(this.formData.items == "") {
                this.itemList = [];
                this.isErr = [];
            }
            
        },
        // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        getFile(event) {
            this.uploadForm.set('files', event.raw);
            this.tip_isShow = true;
            console.log("files:", this.uploadForm.get('files'));
        },
        // 点击文件列表中文件时的钩子
        handlePreview(file) {   
            console.log(file);
            this.pre_isShow = true;
            var _this = this;
            if (typeof(FileReader) !== 'undefined') {
                var reader = new FileReader();
                reader.readAsText(file.raw);
                reader.onload = function () {
                    _this.perview = this.result;
                }
            } else {
                this.$message({
                    message: 'ie9及以下浏览器不支持，请使用chrome或Firefox浏览器',
                    type: 'warning'
                });
            }
            
        },
        // 文件列表移除文件时的钩子
        handleRemove(file, fileList) {
            console.log(file, fileList);

            this.pre_isShow = false;
            this.tip_isShow = false;
        },
        // 文件超出个数限制时的钩子
        handleExceed() {
            this.$message({
                message: '最大允许上传1个文件',
                type: 'warning'
            });
        }
    },
    created() {
        this.$ajax.get("/serverlist").then((response) => {
            console.log("serverList:", response);
            this.serverList = response.data;
        })
        //
        this.uploadForm = new FormData();
    }
}
</script>

<style lang="scss" scoped>
.wrap-box{
    overflow: hidden;
}
.el-upload__tip{
    margin-top: 0;
}
.form-box{
    // width: 600px;
    float: left;
}
.preview-box{
    width: 200px;
    height: 400px;
    margin-top: 10px;
    margin-left: 50px;
    background: #eee;
    float: left;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    overflow-y: auto;
    word-wrap:break-word;
    font-size: 14px;
    color: #606266;
}
</style>


