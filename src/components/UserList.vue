<template>
    <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />

    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/home' }">Homepage</el-breadcrumb-item>
        <!-- <el-breadcrumb-item>Auth Management</el-breadcrumb-item> -->
        <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-row :gutter="25">
            <el-col :span="10">
                <div class="searchBar">
                    <el-input placeholder="Search User" v-model="queryInfo.query" clearable @clear="getUserList"></el-input>
                    <el-button slot="append" icon="Search" @click="getUserList"></el-button>
                </div>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" class="button" @click="addDIalogVisible = true">Add User</el-button> 
            </el-col>
        </el-row>
        
        <el-table :data="userList" border stripe>
            <el-table-column type="index" />
            <el-table-column prop="username" label="Username" />
            <el-table-column prop="password" label="Password" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="role" label="Role" />
            <el-table-column prop="status" label="Status">
                <template v-slot="scope">
                    <!-- {{ scope.row }} -->
                    <el-switch v-model="scope.row.status" @change="userStateChange(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column label="Operation" width="200px">
                <template v-slot="scope">
                    <el-button type="primary" icon="Edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    <el-button type="danger" icon="Delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                    <el-tooltip effect="dark" content="Auth" placement="top-start" :enterable="false">
                        <el-button type="warning" icon="Setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[1, 5, 10, 50]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
            />
  </el-card>

  <el-dialog title="New User Info" v-model="addDIalogVisible" width="50%" @close="addDialogClosed">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="username" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
            <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogClosed">Cancel</el-button>
            <el-button type="primary" @click="addUser">Add</el-button>
        </span>
    </el-form>
  </el-dialog>

  <el-dialog title="Edit User Info" v-model="editDIalogVisible" width="50%" @close="editDialogClosed">
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="username" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
            <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogClosed">Cancel</el-button>
            <el-button type="primary" @click="editUser">Edit</el-button>
        </span>
    </el-form>
  </el-dialog>

</template>

<script>
import { ArrowRight, Search } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from "element-plus";

export default{
    async created(){
        await this.getUserList();
    },
    data(){
        return {
            ArrowRight,
            Search,
            queryInfo:{
                query:"",
                pageNum: 1,
                pageSize: 5
            },
            userList: [],
            total: 0,
            addDIalogVisible: false,
            addForm:{
                username: "",
                password: "",
                email: ""
            },
            editForm:{},
            editDIalogVisible:false,
            addFormRules:{
                username: [
                    { required: true, message: 'Please input username', trigger: 'blur' },
                    { min: 5, max: 8, message: 'Length should be 5~8', trigger: 'blur' },
                ],
                password:[
                    {required: true, message: 'Please input password', trigger: 'blur'},
                    { min: 6, max: 15, message: 'Password length should be 6~15', trigger: 'blur' },
                ],
                email:[
                    {required: true, message: 'Please input email', trigger: 'blur'},
                    { min: 6, max: 15, message: 'Email length should be 6~15', trigger: 'blur' },
                ]
            },
            editFormRules:{
                password:[
                    {required: true, message: 'Please input password', trigger: 'blur'},
                    { min: 6, max: 15, message: 'Password length should be 6~15', trigger: 'blur' },
                ],
                email:[
                    {required: true, message: 'Please input email', trigger: 'blur'},
                    { min: 6, max: 15, message: 'Email length should be 6~15', trigger: 'blur' },
                ]
            },

        }
    },
    methods :{
        async getUserList(){
            const { data } = await this.$http.get("/allUser", {params: this.queryInfo});
            this.userList = data.allUser;
            this.total = data.count;
        },
        async handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },
        async handleCurrentChange(currentPage){
            this.queryInfo.pageNum = currentPage;
            this.getUserList();
        },
        async userStateChange(userInfo){
            const { data } = await this.$http.put(`/userStatus?id=${userInfo.id}&status=${userInfo.status}`);
            if (data != "success"){
                userInfo.status = !userInfo.status;
                return ElMessage({
                    message: 'Fail to change user status',
                    type: 'error',
                    duration: 1500
                });
            }
            return ElMessage({
                message: 'User status updated',
                type: 'success',
                duration: 1500
            });
        },
        async addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data } = await this.$http.post("/addUser", this.addForm);
                if (data != "success"){
                    return ElMessage({
                        message: 'Fail to add user',
                        type: 'error',
                        duration: 1500
                    });
                }
                ElMessage({
                    message: 'User added',
                    type: 'success',
                    duration: 1500
                });
                this.addDIalogVisible=false;
                this.getUserList();
            })
        },
        async addDialogClosed(){
            this.$refs.addFormRef.resetFields();
            this.addDIalogVisible = false;
        },
        deleteUser(id) {
            ElMessageBox.confirm(
                'Delete the user?',
                'Warning',
                {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
                }
            )
            .then(async () => {
                const {data} = await this.$http.delete("deleteUser?id="+id);
                if (data != "success"){
                    ElMessage({
                        type: 'error',
                        message: 'Fail to delete the user',
                    })
                }else{
                    ElMessage({
                        type: 'success',
                        message: 'Successfully delete user',
                    })
                    this.getUserList();
                }
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: 'Delete canceled',
                })
            })
        },
        async showEditDialog(id){
            const {data} = await this.$http.get("getUser?id="+id);
            this.editForm = data.user;
            this.editDIalogVisible = true;
        },
        async editDialogClosed(){
            this.$refs.editFormRef.resetFields();
            this.editDIalogVisible = false;
        },
        async editUser(){
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;
                const { data } = await this.$http.put("updateUser", this.editForm)
                console.log(data)
                if (data != "success"){
                    ElMessage({
                        type: 'error',
                        message: 'Fail to update user info',
                    })
                }else{
                    ElMessage({
                        type: 'success',
                        message: 'Successfully update user info',
                    })
                    this.editDIalogVisible = false;
                    this.getUserList();
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 17px;
}

.el-table{
    margin-top: 15px;
    font-size: 12px;
    min-width: 1080px
}

.searchBar{
    display: flex;
}
</style>