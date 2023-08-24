<template>
    <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />

        <el-container class="home-container">
            <el-header>
                <div>
                    <img src="../assets/logo.svg" alt="logo"/>
                    <span class="top">Reading Management Platform</span>
                </div>
                
                <el-button type="info" @click="logout">Log Out</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64x' : '200px'">
                    <div class="toggle-button" @click="toggleCollapes">
                        |||
                    </div>
                    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409eff"
                    unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                        <el-menu-item :index="menu.path+''" v-for="menu in menus" :key="menu.id">
                            <template #title>
                                <el-icon><component :is="this.icon[menu.id]"/></el-icon>
                                <span>{{menu.title}}</span>
                            </template>
                            
                            <!-- <el-menu-item :index="sub.path+''" v-for="sub in menu.subMenus" :key="sub.id" @click="saveNav(sub.path)">
                                <template #title>
                                    <el-icon><component :is="this.icon[sub.id]"/></el-icon>
                                    <span>{{ sub.title }}</span>
                                </template>
                            </el-menu-item> -->

                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <RouterView></RouterView>
                </el-main>
            </el-container>
        </el-container>

</template>

<script>
    export default {
        data(){
            return {
                menus: [],
                isCollapse: false,
                icon:{
                    '100': 'User',
                    '200': 'Odometer',
                    '300': 'Reading',
                },
                activePath: '/welcome',
            }
        },
        created(){
            this.getMenu();
            this.activePath = window.sessionStorage.getItem("activePath");
        },
        methods: {
            logout(){
                window.sessionStorage.clear();
                this.$router.push("login");   
            },
            async getMenu(){
                const { data } = await this.$http.get("menus");
                if (data.status != 200) return this.$message.error("Fail to get menu list");
                this.menus = data.menus;
            },
            toggleCollapes(){
                this.isCollapse = !this.isCollapse;
            },
            // saveNav(path){
            //     this.activePath = path;
            //     window.sessionStorage.setItem("activePath", this.activePath);
            // }
        }
    }
</script>

<style>
.home-container{
    height:100%
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding-left: 0%; */
    color:#fff;
    font-size: 20px;
}

.el-header > div {
    display: flex;
    align-items: center;
}

.el-header > div > span{
    margin-left: 15px;
}


.el-aside {
background-color: #333744;
}

.el-aside > .el-menu {
    border: none;
}

.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align:center;
    letter-spacing: 0.2em;
    cursor: pointer;
}


.el-main {
background-color: #eaedf1;
}

img{
    width: 55px;
    height: 55px
}
</style>