<template>
    <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />

    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.svg" alt="form_pic"/>
            </div>
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="username" :prefix-icon="User">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="password" type="password" :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login" round>Login</el-button>
                    <el-button type="info" @click="resetLogin" round>Reset</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>


<script>
import { User, Lock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

export default{
    data(){
        return {
            User, 
            Lock,
            loginForm:{
                username: "admin",
                password: "123456",
            },
            loginRules:{
                username:[
                    {required: true, message: 'Please input username', trigger: 'blur'},
                    { min: 5, max: 8, message: 'Username length should be 5~8', trigger: 'blur' },
                ],
                password:[
                    {required: true, message: 'Please input password', trigger: 'blur'},
                    { min: 6, max: 15, message: 'Password length should be 6~15', trigger: 'blur' },
                ]
            },
        };
    },
    // setup(){
    //     return {User, Lock};
    // },
    methods: {
        login(){
            // all rules are satisfied
            this.$refs.loginFormRef.validate(async valid=> {
                if (!valid) return
                const {data} = await this.$http.post("login", this.loginForm);
                if (data.flag == "ok"){
                    ElMessage.success("success");
                    this.$router.push({path:"/home"});
                    window.sessionStorage.setItem("user", data.user);
                }else{
                    ElMessage.error("fail")
                }
            })
        },

        resetLogin(){
            this.$refs.loginFormRef.resetFields();
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}

.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform:translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 70%;
            height: 70%;
            position: absolute;
            left: 50%;
            top:50%;
            transform:translate(-50%,-50%);
            // border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.btns{
    margin-left: 30%;
}

</style>
  