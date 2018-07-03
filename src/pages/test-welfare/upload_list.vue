<template>
    <div class="wrap-box">
        <el-row>
            <el-col :span="6">
                <div class="form-box">
                    <el-upload
                    class="upload-demo"
                    drag
                    action="/betawelfare/upload"
                    :auto-upload="false"
                    :limit="1"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="getFile"
                    :on-exceed="handleExceed">
                    <i class="el-icon-upload"></i>

                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>

                    <el-button type="primary" class="subBtn" @click="onSubmit">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                </div>
            </el-col>
            <el-col :span="15">
                <transition name="slide-fade">
                    <el-card class="box-card" v-show="card_isShow">
                        <div slot="header" class="clearfix">
                            <span>文件预览</span>
                        </div>
                        <div class="per-box">
                            {{ perview }}
                        </div>
                    </el-card>
                </transition>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'upload_list',
    data() {
        return {
            perview: '',
            card_isShow: false,
            uploadForm: new FormData()
        }
    },
    methods: {
        // 点击文件列表中已上传的文件时的钩子
        handlePreview(file) {
            
        },
        // 文件列表移除文件时的钩子
        handleRemove() {
            this.perview = '';
            this.card_isShow = false;
            
            this.uploadForm.delete('file');
        },
        // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
        getFile(file) {
            var _this = this;

            this.uploadForm.set('file', file.raw);
            console.log(this.uploadForm.get('file'));
            
            if (typeof(FileReader) !== 'undefined') {
                var reader = new FileReader();
                reader.readAsText(file.raw);
                reader.onload = function () {
                    _this.perview = this.result;
                    _this.card_isShow = true;
                }
            } else {
                this.$message({
                    message: 'ie9及以下浏览器不支持，请使用chrome或Firefox浏览器',
                    type: 'warning'
                });
            }
        },
        // 文件超出个数限制时的钩子
        handleExceed() {
            this.$message({
                message: '最大允许上传1个文件',
                type: 'warning'
            });
        },

        onSubmit() {

            if (this.uploadForm.get('file')) {
                this.$ajax.post("/betawelfare/upload", this.uploadForm).then(response => {
                    console.log("feedback", response);
                    
                })     
            } else {
                this.$message({
                    message: '请先上传文件',
                    type: 'warning'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap-box{
    overflow: hidden;
}
.form-box{
    width: 360px;
}
.subBtn{
    margin-top: 10px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both
}
.box-card {
    width: 70%;
    margin-left: 200px;
}
.per-box{
    max-height: 220px;
    overflow-y: auto;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>

