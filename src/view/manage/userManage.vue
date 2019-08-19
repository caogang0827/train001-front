<template>
  <div style="margin-top: 10px">

    <!--  添加、修改用户模态框start  -->
    <el-dialog title="用户信息" :visible.sync="flag">

      <el-form :model="userInfo" :rules="rules" ref="userInfo" style="width: 600px" label-width="100px" class="demo-ruleForm">

        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="userInfo.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginname">
          <el-input v-model="userInfo.loginname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="userInfo.password" autocomplete="off" type="password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="rpassword">
          <el-input type="password" v-model="userInfo.rpassword" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="电话" :label-width="formLabelWidth" prop="tel">
          <el-input v-model="userInfo.tel" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="userInfo.email" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-select v-model="userInfo.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth" prop="url">
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
        <el-button type="reset"  @click="resetForm('userInfo')">重 置</el-button>
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="save('userInfo')">确 定</el-button>
      </div>

    </el-dialog>
    <!--  添加、修改用户模态框end  -->

    <!--  用户绑定角色模态框start  -->
    <el-dialog title="用户信息" :visible.sync="flag1">

      <el-form style="width: 600px">

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
    <!--  添加、修改用户模态框start  -->

    <!--  在线表格模态框start  -->
    <!--    <el-dialog title="用户添加表格" :visible.sync="tableFlag" style="width: 1400px">-->
    <!--    <iframe width="645" height="500"-->
    <!--            style="border:1px solid #ccc" frameborder="0" scrolling="no"-->
    <!--            src="https://docs.zoho.com.cn/sheet/published.do?rid=cp9nb2f685d96301a465ebe77034f931aaf2a&mode=embed"> -->
    <!--    </iframe>-->
    <!--    </el-dialog>-->
    <!--  在线表格模态框end  -->

    <!--  表格以上查询输入框、按钮start  -->
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
      </el-select>&nbsp;
      <el-button type="primary" size="small" @click="find">查询</el-button>
      <el-button type="primary" size="small" @click="toadd" v-show="addbutton">添加用户</el-button>
      <el-button type="danger" size="small" @click="ps" v-show="deletebutton">批量删除</el-button>
      <el-button type="primary" size="small" @click="exportUser" style="float: left;margin-top: 15px;margin-left: 20px" v-show="exportbutton"><i class="el-icon-upload2"></i> 导出数据</el-button>
      <!--    <el-button type="primary"  size="small" @click="importUser"><i class="el-icon-download"></i>导入数据</el-button>-->
      <el-upload
        class="upload-demo"
        action="http://localhost:10001/user/addExcel"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :on-success="handleSuccess"
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary" style="float: left;margin-left: 20px;margin-top: 15px" v-show="importbutton"><i class="el-icon-download"></i> 导入数据</el-button>
      </el-upload>
    </span>
    <!--  表格以上查询输入框、按钮end  -->

    <!--  表格start  -->
    <el-table
      :data="tableData"
      height="440"
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        type="selection"
        width="80"
      >
      </el-table-column>

      <el-table-column
        prop="username"
        label="用户名">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>
              <el-avatar :src="'http://localhost:9999/'+scope.row.url"></el-avatar>
            </p>
            <p>用户名: {{ scope.row.username }}</p>
            <p>登录名: {{ scope.row.loginname }}</p>
            <p>性  别:
              <span v-if="scope.row.sex==1">男</span>
              <span v-if="scope.row.sex==0">女</span>
            </p>
            <p>电  话: {{ scope.row.tel}}</p>
            <p>邮  箱: {{ scope.row.email}}</p>
            <!--<p>角  色: {{ scope.row.roleInfo ? scope.row.roleInfo.rolename : "未绑定" }}</p>-->
            角  色: <span style="font-weight: bolder;color: deeppink">{{ scope.row.roleInfo ? scope.row.roleInfo.rolename : "未绑定" }}</span>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.username }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="loginname"
        label="登录名"
        width="130"
      >
      </el-table-column>

      <el-table-column
        label="性别"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.sex==1?'男':'女'}}</template>
      </el-table-column>

      <el-table-column
        prop="tel"
        label="电话"
        width="130"
      >
      </el-table-column>

      <el-table-column
        label="创建日期"
        width="130"
      >
        <template slot-scope="scope">{{ scope.row.createdtime.substring(0,10)}}</template>
      </el-table-column>

      <el-table-column
        label="头像"
        width="100"
      >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">

            <!--<el-image  :src="'http://49.232.19.36:8888/group1/'+scope.row.url+'_50x50.png'"></el-image>-->

            <el-image style="width: 600px; height: 600px" :src="'http://localhost:9999/'+scope.row.url">{{scope.row.url}}</el-image>

            <div slot="reference" class="name-wrapper">
              <el-image style="width: 50px; height: 50px" :src="'http://localhost:9999/'+scope.row.url">{{scope.row.url}}</el-image>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
        prop="roleInfo.rolename"
        label="角色"
        width="130"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="370"
      >
        <template slot-scope="scope">
          <el-button type="danger" round size="small" @click="todelete(scope.row.id)" v-show="deletebutton">删除</el-button>
          <el-button type="primary" round size="small" @click="toupdate(scope.row)" v-show="updatebutton">编辑</el-button>
          <el-button type="success" round size="small" @click="tobind(scope.row)" v-show="bindbutton">绑定角色</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!--  表格end  -->

    <!--  分页start  -->
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
    <!--  分页end  -->

  </div>

</template>

<script>

  export default {

    name: "userManage",

    data() {

      //密码确认
      const validatePass2 = (rule, value, callback) => {

        if (value === '') {

          callback(new Error('请再次输入密码'));

        } else if (value !== this.formInline.password) {

          callback(new Error('两次输入密码不一致!'));

        } else {

          callback();

        }
      };

      //数据
      return {

        //起止时间
        createdtime: ["", ""],

        //查询实体
        queryEntity: {
          page: 0,
          pageSize: 3,
          iname: "",
          isex: "",
          start: "",
          end: "",
        },

        //表格数据
        tableData: [],

        //角色列表
        roleList: [],

        //数据总条数
        total: 100,

        //ID数组（批量删除用）
        ids: [],

        //控制模态框显示/隐藏
        flag: false,
        flag1: false,
        tableFlag: false,

        //添加/修改对象
        userInfo: {},

        formLabelWidth: '80px',

        //头像地址
        imageUrl: '',

        //角色/用户ID（用户绑定角色使用）
        roleId: '',
        userId: '',

        //上传文件列表
        fileList: [],

        //表单验证
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          loginname: [
            { required: true, message: '请输入登录名', trigger: 'blur' },
          ],
          sex: [
            { required: true, message: '请至少选择一个',  trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          rpassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '请输入电话号', trigger: 'blur' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, message: '请输入正确的邮箱地址' }
          ],
        },


      }
    },

    methods: {

      //上传文件成功后返回
      handleSuccess(file, fileList) {
        console.log(file, fileList);
      },

      //上传文件移除后返回
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },

      //上传文件前触发
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },

      //移除文件前触发
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },

      //查询所有角色
      findAllRole: function () {
        this.$axios.post(this.domain.serverpath + 'role/listRole?find=1').then((response) => {
          this.roleList = response.data.content;
        }).catch(() => {
        })
      },

      //在线表格展示
      // hoverUsername(){
      //   this.tableFlag = true;
      // },

      //分页查询
      pageAll: function (page) {
        if (this.createdtime[0] !== "" && this.createdtime[1] !== "") {
          this.queryEntity.start = this.createdtime[0];
          this.queryEntity.end = this.createdtime[1];
        }
        this.queryEntity.page = page - 1;
        this.$axios.post(this.domain.serverpath + 'user/listUser', this.queryEntity).then((response) => {
          this.queryEntity.page = response.data.number;
          this.tableData = response.data.content;
          this.total = response.data.totalElements;
          this.queryEntity.pageSize = response.data.size;
        }).catch((error) => {
        })
      },

      //获取对象ID数组
      handleSelectionChange: function (data) {
        this.ids = data.map(element => element.id);
      },

      //条件查询
      find: function () {
        this.pageAll(1);
      },

      //分页条数改变查询
      handleSizeChange: function (data) {
        this.queryEntity.pageSize = data;
        this.pageAll(1);
      },

      //删除方法
      todelete: function (id) {
        if (confirm("确认删除？")) {
          this.$axios.post(this.domain.serverpath + 'user/deleteUser?id=' + id).then((response) => {
            if (response.data) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
            }
            this.pageAll(1);
          }).catch((response) => {
            if (response.data === undefined) {
              this.$notify.error({
                title: '错误',
                message: '您没有此项权限！'
              });
            }
          })
        }
      },

      //批量删除
      ps: function () {
        if (this.ids.length === 0) {
          this.$message.error('至少选择一条数据！');
        } else {
          this.todelete(this.ids);
        }
      },

      //添加用户
      toadd: function () {
        this.userInfo = {};
        this.imageUrl = "";
        this.flag = true;
        if(this.$refs.userInfo){
          this.$refs.userInfo.resetFields();
        }
      },

      //修改用户
      toupdate: function (data) {
        this.flag = true;
        this.userInfo = data;
        this.userInfo.password = data.password.substring(0, 10);
        this.userInfo.rpassword = data.password.substring(0, 10);
        this.imageUrl = "http://localhost:9999/" + data.url;
      },

      //保存
      save: function (userInfo) {
        this.flag = false;
        this.$refs[userInfo].validate((valid) => {
          if (valid) {
            alert('submit!');
            let uri = this.domain.serverpath + "user/addUser";
            if (this.userInfo.id !== undefined) {
              uri = this.domain.serverpath + "user/updateUser"
            }
            this.$axios.post(uri, this.userInfo).then((response) => {
              if (uri.endsWith("addUser") && response.data) {
                this.$message({
                  message: '添加成功！',
                  type: 'success'
                });
                this.pageAll(1);
              } else if (uri.endsWith("updateUser") && response.data) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                this.pageAll(1);
              }
            }).catch((response) => {
              if (response.data === undefined && uri.endsWith("updateUser")) {
                this.$notify.error({
                  title: '错误',
                  message: '您没有此项权限！'
                });
              }
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户数据不能为空！'
            });
            return false;
          }
        });
      },

      //图片添加成功
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.userInfo.url = file.name;
      },

      //绑定角色
      tobind: function (data) {
        this.roleId = '';
        if (data.roleInfo !== null) {
          this.roleId = data.roleInfo.id;
        }
        this.userId = data.id;
        this.flag1 = true;
      },

      //绑定成功
      save1: function () {
        this.flag1 = false;
        this.$axios.post(this.domain.serverpath + 'role/bindRole?userId=' + this.userId + '&roleId=' + this.roleId).then((response) => {
          if (response.data) {
            this.$message({
              message: '绑定成功！',
              type: 'success'
            });
          }
          this.pageAll(1);
        }).catch((response) => {
          if (response.data === undefined) {
            this.$notify.error({
              title: '错误',
              message: '您没有此项权限！'
            });
          }
        })
      },

      //导出用户数据
      exportUser: function () {
        this.$axios.post(this.domain.serverpath + 'user/uploadUser', this.queryEntity).then((response) => {
          if (response.data) {
            this.$message({
              message: '导出成功！',
              type: 'success'
            });
          }
        }).catch((response) => {
          if (response.data === undefined) {
            this.$notify.error({
              title: '错误',
              message: '您没有此项权限！'
            });
          }
        })
      },

      //重置表单
      resetForm(userInfo) {
        this.$refs[userInfo].resetFields();
      }

    },

    //预加载函数
    mounted() {
      this.pageAll(1);
      this.findAllRole();
      if(this.$store.state.authormap['/user/addUser']===""){
        this.addbutton = true;
      }
      if(this.$store.state.authormap['/user/deleteUser']===""){
        this.deletebutton = true;
      }
      if(this.$store.state.authormap['/user/importUser']===""){
        this.importbutton = true;
      }
      if(this.$store.state.authormap['/user/uploadUser']===""){
        this.exportbutton = true;
      }
      if(this.$store.state.authormap['/user/updateUser']===""){
        this.updatebutton = true;
      }
      if(this.$store.state.authormap['/role/bindRole']===""){
        this.bindbutton = true;
      }
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

  el-input{
    width: 100px;
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
