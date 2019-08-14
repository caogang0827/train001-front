<template>
  <div style="margin-top: 10px">

    <el-dialog title="用户信息" :visible.sync="flag" style="width: 1400px">
      <el-form :model="userInfo">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userInfo.username" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="登录名" :label-width="formLabelWidth">
          <el-input v-model="userInfo.loginname" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="userInfo.password" autocomplete="off" type="password" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="userInfo.tel" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="性别 " :label-width="formLabelWidth">
          <el-select v-model="userInfo.sex" placeholder="请选择活动区域" style="width: 200px">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像 " :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            ref="addUpload"
            action="http://localhost:10001/user/addPhoto"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :auto-upload="true">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户信息" :visible.sync="flag1" style="width: 1400px">
      <el-form >
        <el-form-item label="角色 " :label-width="formLabelWidth">
          <el-select v-model="roleId" filterable placeholder="请选择角色">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.rolename"
              :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag1 = false">取 消</el-button>
        <el-button type="primary" @click="save1">确 定</el-button>
      </div>
    </el-dialog>




  <span style="margin-top: 10px;margin-bottom: 10px;margin-left: 20px">
    用户名：
  <el-input v-model="queryEntity.iname" placeholder="请输入内容" style="width: 150px"></el-input>
  创建时间：
  <el-date-picker
    v-model="createdtime"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期">
  </el-date-picker>
  性别：
    <el-select v-model="queryEntity.isex">
      <el-option label="男" value="1"></el-option>
      <el-option label="女" value="0"></el-option>
      <el-option label="全部" value=""></el-option>
    </el-select>
    &nbsp;
    <el-button type="primary"  size="small" @click="find">查询</el-button>
    <el-button type="primary"  size="small" @click="toadd">添加用户</el-button>
    <el-button type="danger"  size="small" @click="ps">批量删除</el-button>
  </span>
  <el-table
    :data="tableData"
    height="520"
    style="width: 100%;margin-top: 10px"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="80">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      width="130">
    </el-table-column>
    <el-table-column
      prop="loginname"
      label="登录名"
      width="130">
    </el-table-column>
    <el-table-column
      label="性别"
      width="80">
      <template slot-scope="scope">{{ scope.row.sex==1?'男':'女'}}</template>
    </el-table-column>
    <el-table-column
      prop="tel"
      label="电话"
      width="130">
    </el-table-column>
    <el-table-column
      label="创建日期"
      width="130">
      <template slot-scope="scope">{{ scope.row.createdtime.substring(0,10)}}</template>
    </el-table-column>
    <el-table-column
      label="头像"
      width="100">
      <template slot-scope="scope">
        <el-image style="width: 50px; height: 50px" :src="'http://localhost:9999/'+scope.row.url">{{scope.row.url}}</el-image>
      </template>
    </el-table-column>
    <el-table-column
      prop="roleInfo.rolename"
      label="角色"
      width="130">
    </el-table-column>
    <el-table-column
      label="操作"
      width="370">
      <template slot-scope="scope">
        <el-button type="danger" round size="small" @click="todelete(scope.row.id)">删除</el-button>
        <el-button type="primary" round size="small" @click="toupdate(scope.row)">编辑</el-button>
        <el-button type="success" round size="small" @click="tobind(scope.row)">绑定角色</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="pageAll"
      :current-page.sync="queryEntity.page+1"
      :page-sizes="[3, 5, 10, 20]"
      :page-size="queryEntity.pageSize"
      layout="sizes, prev, pager, next"
      :total="total"
      style="text-align: center">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "userManage",

    data() {
      return {
        createdtime: ["", ""],
        queryEntity: {
          page: 0,
          pageSize: 3,
          iname: "",
          isex: "",
          start: "",
          end: "",
        },
        tableData: [],
        roleList: [],
        total:100,
        ids:[],
        flag:false,
        flag1:false,
        userInfo: {},
        formLabelWidth: '100px',
        imageUrl: '',
        roleId: '',
        userId: '',
      }
    },

    methods: {

      //查询所有角色
      findAllRole:function(){
        this.$axios.post(this.domain.serverpath+'role/listRole?find=1').then((response)=>{
          this.roleList = response.data.content;
        }).catch(()=>{})
      },

      //分页查询
      pageAll:function(page){
        if(this.createdtime[0]!==""&&this.createdtime[1]!==""){
          this.queryEntity.start = this.createdtime[0];
          this.queryEntity.end = this.createdtime[1];
        }
          this.queryEntity.page = page - 1;
        this.$axios.post(this.domain.serverpath+'user/listUser',this.queryEntity).then((response)=>{
          this.queryEntity.page = response.data.number;
          this.tableData = response.data.content;
          this.total = response.data.totalElements;
          this.queryEntity.pageSize = response.data.size;
          }).catch((error)=>{})
      },

      //获取对象数组
      handleSelectionChange: function (data) {
        this.ids = data.map(element=>element.id);
      },

      //查询
      find:function () {
        this.pageAll(1);
      },

      //分页条数改变
      handleSizeChange:function (data) {
        this.queryEntity.pageSize = data;
        this.pageAll(1);
      },

      //删除
      todelete:function (id) {
        if (confirm("确认删除？")){
          this.$axios.post(this.domain.serverpath+'user/deleteUser?id='+id).then((response)=>{
            if(response.data){
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
            }
            this.pageAll(1);
          }).catch((response)=>{
            if(response.data===undefined){
              this.$notify.error({
                title: '错误',
                message: '您没有此项权限！'
              });
            }
          })
        }
      },

      //批量删除
      ps:function () {
        if(this.ids.length===0){
          this.$message.error('至少选择一条数据！');
        }else{
          this.todelete(this.ids);
        }
      },

      //添加
      toadd:function () {
        this.userInfo = {};
        this.userInfo.sex = "1";
        this.imageUrl = "";
        this.flag = true;
      },

      //修改
      toupdate:function(data){
        this.userInfo = data;
        this.userInfo.sex = data.sex.toString();
        this.userInfo.password = data.password.substring(0,10);
        this.flag = true;
        this.imageUrl = "http://localhost:9999/"+data.url;
      },

      //保存
      save:function () {
        this.flag = false;
        let uri = this.domain.serverpath+"user/addUser";
        if(this.userInfo.id!==undefined){
          uri = this.domain.serverpath+"user/updateUser"
        }
        this.$axios.post(uri,this.userInfo).then((response)=>{
          if(uri.endsWith("addUser")&&response.data){
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.pageAll(1);
          }else if(uri.endsWith("updateUser")&&response.data){
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.pageAll(1);
          }
        }).catch((response)=>{
          if(response.data===undefined&&uri.endsWith("updateUser")){
            this.$notify.error({
              title: '错误',
              message: '您没有此项权限！'
            });
          }
        })
      },

      //图片添加成功
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.userInfo.url = file.name;

      },

      //绑定角色
      tobind:function (data) {
        this.roleId = '';
        if(data.roleInfo!==null){
          this.roleId = data.roleInfo.id;
        }
        this.userId = data.id;
        this.flag1 = true;
      },
      
      //绑定成功
      save1:function () {
        this.flag1 = false;
        this.$axios.post(this.domain.serverpath+'role/bindRole?userId='+this.userId+'&roleId='+this.roleId).then((response)=>{
          if(response.data){
            this.$message({
              message: '绑定成功！',
              type: 'success'
            });
          }
          this.pageAll(1);
        }).catch((response)=>{
          if(response.data===undefined){
            this.$notify.error({
              title: '错误',
              message: '您没有此项权限！'
            });
          }
        })
      }


    },

    mounted() {
      this.pageAll(1);
      this.findAllRole();
    }

  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
