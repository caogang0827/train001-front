<template>
  <div style="margin-top: 10px">
    <el-dialog title="角色信息" :visible.sync="flag" style="width: 1400px">
      <el-form :model="roleInfo">

        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="roleInfo.rolename" autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="roleInfo.description"></el-input>
        </el-form-item>

        <el-form-item label="角色等级" :label-width="formLabelWidth">
          <el-select v-model="roleInfo.level" filterable placeholder="请选择等级">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              v-show="role.level > dlevel ? true : false"
              :label="role.level"
              :value="role.level">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
          </el-tree>
<!--          <el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
<!--          <el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
<!--          <el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
<!--          <el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetChecked" type="danger">清空</el-button>
        <el-button @click="flag = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <span style="margin-top: 10px;margin-bottom: 10px;text-align: center;margin-left: 350px">
    角色名称：
  <el-input v-model="iname" placeholder="请输入内容" style="width: 300px"></el-input>
    &nbsp;
    <el-button type="primary"  size="small" @click="find">查询</el-button>
    <el-button type="primary"  size="small" @click="toadd" v-show="addbutton">添加角色</el-button>
    <el-button type="danger"  size="small" @click="ps" v-show="deletebutton">批量删除</el-button>
  </span>
    <el-table
      :data="tableData"
      height="220"
      style="width: 100%;margin-top: 10px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="150">
      </el-table-column>
      <el-table-column
        prop="rolename"
        label="角色名称"
        width="350">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>角色名: {{ scope.row.rolename }}</p>
            <p>角色描述: {{ scope.row.description }}</p>
            用 户: <span style="font-weight: bolder;color: deeppink">{{ scope.row.users}}</span>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.rolename }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="角色描述"
        width="370">
      </el-table-column>
      <el-table-column
        label="操作"
        width="430">
        <template slot-scope="scope">
          <el-button type="danger" round size="small" @click="todelete(scope.row)" v-show="deletebutton">删除</el-button>
          <el-button type="primary" round size="small" @click="toupdate(scope.row)" v-show="updatebutton">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="pageAll"
      background
      :current-page.sync="page"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      style="text-align: center">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "roleManage",

    data() {
      return {
        formLabelWidth: '100px',
        roleInfo: {},
        tableData: [],
        flag: false,
        iname: '',
        ids: [],
        page: 1,
        pageSize: 3,
        total: 100,

        //角色列表
        roleList: [],

        //登录用户角色等级
        dlevel: 0,

        data: [],
        defaultProps: {
          children: 'menuInfoList',
          label: 'name'
        },
      }
    },

    methods: {

      pageAll: function (page) {
        this.page = page;
        this.$axios.post(this.domain.serverpath+'role/listRole?page='+(page-1)+'&iname='+this.iname).then((response)=>{
          this.tableData = response.data.content;
          this.total = response.data.totalElements;
        }).catch((error)=>{})

      },

      //获取对象数组
      handleSelectionChange: function (data) {
        this.ids = data.map(element=>element);
      },

      //查询
      find:function () {
        this.pageAll(1);
      },

      //删除
      todelete:function (data) {
        if(data.level <= this.dlevel) {
          this.$notify.error({
            title: '错误',
            message: '您的等级不足！'
          });
        }else{
          if (confirm("确认删除？")){
            this.$axios.post(this.domain.serverpath+'role/deleteRole?id='+id).then((response)=>{
              if(response.data===0){
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                });
                this.pageAll(1);
              }else{
                this.$notify.error({
                  title: '错误',
                  message: '还有'+response.data+'名用户！'
                });
              }
            }).catch((response)=>{
              if(response.data===undefined){
                this.$notify.error({
                  title: '错误',
                  message: '您没有此项权限！'
                });
              }
            })
          }
        }
      },

      //批量删除
      ps:function () {
        if(this.ids.length===0){
          this.$message.error('至少选择一条数据！');
        }else{
          this.ids.forEach(item=>{
            this.todelete(item);
          })
        }
      },
      
      toadd:function () {
        this.roleInfo = {};
        this.flag = true;
        this.$refs.tree.setCheckedKeys([]);

      },
      
      toupdate:function (data) {
        if(data.level < this.dlevel){
          this.$notify.error({
            title: '错误',
            message: '您的等级不足！'
          });
        }else{
          this.flag = true;
          this.roleInfo = data;
          setTimeout(()=>{
            this.$refs.tree.setCheckedKeys(data.authKeys);
          },0)
        }
      },
      
      save:function () {
        this.flag = false;
        this.roleInfo.authKeys = (this.$refs.tree.getHalfCheckedKeys()+","+this.$refs.tree.getCheckedKeys()).split(",");
        let uri = this.domain.serverpath+"role/addRole";
        if(this.roleInfo.id!==undefined){
          uri = this.domain.serverpath+"role/updateRole"
        }
        if(uri.endsWith("updateRole") && this.roleInfo.level === this.dlevel){
          this.$notify.error({
            title: '错误',
            message: '您的等级不足！'
          });
        }else{
          this.$axios.post(uri,this.roleInfo).then((response)=>{
            if(uri.endsWith("addRole")&&response.data){
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.pageAll(1);
            }else if(uri.endsWith("updateRole")&&response.data){
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.pageAll(1);
            }
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

      tobind:function () {
        
      },

      getCheckedNodes() {
        console.log((this.$refs.tree.getHalfCheckedKeys()+","+this.$refs.tree.getCheckedKeys()).split(","));
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys(data) {
        this.$refs.tree.setCheckedKeys(data);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },

      findAllMenu:function(){
        this.$axios.post(this.domain.serverpath+'menu/listMenu').then((response)=>{
          this.data = response.data;
        }).catch(()=>{})
      },

      //查询所有角色
      findAllRole: function () {
        this.$axios.post(this.domain.serverpath + 'role/listRole?find=1').then((response) => {
          this.roleList = response.data.content;
        }).catch(() => {
        })
      },

    },

    mounted() {
      this.findAllMenu();
      this.pageAll(1);
      this.findAllRole();
      this.dlevel = this.$store.state.userInfo.roleInfo.level;
      if(this.$store.state.authormap['/role/deleteRole']===""){
        this.deletebutton = true;
      }
      if(this.$store.state.authormap['/role/updateRole']===""){
        this.updatebutton = true;
      }
      if(this.$store.state.authormap['/role/addRole']===""){
        this.addbutton = true;
      }
    }

  }
</script>

<style scoped>

</style>
