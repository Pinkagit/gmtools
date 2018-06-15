<template>
    <div class="back_wrap">
        <div class="box_wrap">
            <div class="title">
            </div>
            <div class="box">
                <!-- login -->
                <el-form ref="form" size="small" :model="formData" v-show="isShow" :rules="rules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="formData.username"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="formData.password" @keyup.native.enter="GMLogin"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-col :span="9">
                            <el-checkbox v-model="checked">记住用户名</el-checkbox>
                        </el-col>

                         <el-col :span="5" :offset="5">
                            <el-button type="success" @click="toRegist">注册</el-button>
                        </el-col >
                        <el-col :span="5" style="text-align:right;">
                             <el-button type="primary" @click="GMLogin">登入</el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
                <!-- regist -->
                <el-form ref="reg_form" size="small" :model="reg_formData" v-show="!isShow" :rules="reg_rules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="reg_formData.username"></el-input>
                    </el-form-item>

                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="reg_formData.name"></el-input>
                    </el-form-item>

                    <el-form-item label="部门" prop="department">
                        <el-col :span="24">
                            <el-select v-model="reg_formData.department"  placeholder="请选择" style="width:100%;">
                                <el-option
                                v-for="item in op_list"
                                :key="item.value"
                                :label="item.name"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="reg_formData.password"></el-input>
                    </el-form-item>

                    <el-form-item label="再次输入密码" prop="passwordagin">
                        <el-input type="password" v-model="reg_formData.passwordagin"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-col :span="5" :offset="13">
                            <el-button type="success" @click="Regist">注册</el-button>
                        </el-col >
                        <el-col :span="6" style="text-align:right;">
                             <el-button type="primary" @click="toLogin">去登入</el-button>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "@/store/unit.js";

export default {
    
    data() {
        let valid_password = (rule, value, callback) => {
            if (value != this.reg_formData.password) {
                callback(new Error('两次输入的密码不同'));
            } else {
                callback();
            }
        }
        return {
            formData: {
                username: '',
                password: ''
            },
            checked: false,
            isShow: true,

            reg_formData: {
                username: '',
                name: '',
                department: '',
                password: '',
                passwordagin: ''
            },
            op_list: [],

            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'change' }
                ]
            },
            reg_rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                department: [
                    { required: true, message: '请选择部门', trigger: 'change' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                passwordagin: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                     { validator: valid_password, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        toRegist() {
            this.isShow = false;
        },
        toLogin() {
            this.isShow = true;
        },
        Regist() {
            this.$refs['reg_form'].validate((valid) => {
                if (valid) {
                    console.log("reg_formData", this.reg_formData);
                    
                    this.$ajax.post("/regist", this.reg_formData).then(response => {
                        console.log("feedback", response);

                        if (response.data.err) {
                            this.$message({
                                message: response.data.err,
                                type: 'warning'
                            });
                        } else {
                            this.$message({
                                message: response.data.retdesc,
                                type: 'warning'
                            });
                        }
                    }).catch(error => {
                        console.log(error);
                    })
                    
                } else {
                    return false;
                }
            })
        },
        GMLogin() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    
                    console.log("formData", this.formData);

                    this.$ajax.post("/login", this.formData).then(response => {
                        console.log("feedback", response);

                        if (response.data.err) {
                            this.$message({
                                message: response.data.err,
                                type: 'warning'
                            });
                        } else {
                            if (this.checked) {
                                _.setCookie('username', this.formData.username, 30);
                                _.setCookie('password', this.formData.password, 30);
                            }
                            this.$router.push({ path: response.data.url })
                        }
                        
                    }).catch(error => {
                        console.log(error);
                    })
                    
                } else {
                    return false;
                }
            })
        }
    },
    created() {
        this.$ajax.get("/static/index.json").then(response => {
            console.log("index.json", response);

            this.op_list = response.data.depList;
        })

        let username = _.getCookie('username');
        let password = _.getCookie('password');

        if (username && password) {
            this.formData.username = username;
            this.formData.password = password;
        }
    }
}
</script>

<style scoped>
.back_wrap{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    background: url("../assets/img/login.jpg");
    background-size: 100% 100%;
}
.box_wrap{
    width: 340px;
    transform: translate(-50%, -50%);
    position: absolute;
    left: 50%;
    top: 50%;
}
.title{
    width: 100%;
    height: 80px;
    position: absolute;
    top: -80px;
    background: url("../assets/img/title04.png") no-repeat;
}
.box{
    width: 100%;
    height: 100%;;
    background: #fff;
    margin-top: 15px;
    box-sizing: border-box;
    padding: 25px;
}
</style>


