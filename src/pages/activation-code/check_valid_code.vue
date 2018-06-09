<template>
    <div class="wrap">
        <el-col :span="9">
            <div class="form-box">
                <el-form ref="form" :model="formData" :rules="rules" label-position="right" label-width="100px">

                    <el-form-item label="服务器检验码" prop="zoneid">
                        <el-col :span="12">
                            <el-input v-model="formData.zoneid"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="类型" prop="type">
                        <el-col :span="12">
                            <el-input v-model="formData.type"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="数量" prop="num">
                        <el-col :span="12">
                            <el-input v-model.number="formData.num"></el-input>
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
                <el-card class="box-card" v-show="giftcode">
                    <div slot="header" class="clearfix">
                        <span>激活码</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="downCsv">下载CSV</el-button>
                    </div>
                    <div class="code-box">
                        <span v-for="(item, index) in arrGiftcode" :key="index">{{ item }}</span>
                    </div>
                </el-card>
            </transition>
        </el-col>
    </div>
</template>

<script>
import _ from "@/store/FileSaver.min.js";

export default {
    data() {
        return {
            formData: {
                zoneid: '',
                type: '',
                num: ''
            },
            rules: {},
            giftcode: "",
            arrGiftcode: []
        }
    },
    methods: {
        onSubmit() {
            console.log("formData", this.formData);
            
            this.$ajax.post("/api/giftcode/select", this.formData).then(response => {
                console.log("giftcode", response);

                if (response.data.retcode == 0) {
                    this.giftcode = response.data.data;
                    this.arrGiftcode = response.data.data.split(";");

                    if (response.data.data == "") {
                        this.$notify({
                            title: '错误',
                            message: "参数出错",
                            type: 'error'
                        });
                    }
                    
                } else if (response.data.retcode == 1) {
                    this.$notify({
                        title: '错误',
                        message: response.data.retdesc,
                        type: 'error'
                    });
                    this.giftcode = "";
                }
                
            }).catch(error => {
                console.log(error);
            })
        },
        downCsv() {
            let fileInfo = "";

            for(let i = 0, len = this.arrGiftcode.length; i < len; i++) {
                if(this.arrGiftcode[i].length > 4) {
                    fileInfo += this.arrGiftcode[i];
                    fileInfo += '\n';
                }
            }
            this.exportCsv("codes.csv", fileInfo);
        },
        exportCsv(filename, out) {
            //Excel打开后中文乱码添加如下字符串解决
            //var exportContent = "\uFEFF";
            var blob = new Blob([out],{type: "text/plain;charset=utf-8"});
            _.saveAs(blob, filename);
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    overflow: hidden;
}
.form-box{
    float: left;
    width: 100%;
}

.clearfix:before, .clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
.box-card{
    float: left;
    width: 400px;
}
.code-box{
    word-break: break-all;
    max-height: 145px;
    overflow-y: auto;
}
.code-box>span{
    display: inline-block;
    width: 50%;
    text-align: center;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>


