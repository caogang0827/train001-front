<template>

  <div class="buttons" style="margin-top: 20px">

    <!--  弹出框start  -->

    <el-dialog title="权限列表信息" :visible.sync="flag">

      <el-form ref="form" :model="alertData" label-width="200px" size="mini">
        <el-button type="primary" @click="toAdd()" icon="el-icon-plus" plain circle></el-button>
        <el-button type="primary" @click="toUpdate()" icon="el-icon-edit" circle></el-button>
        <el-button type="danger" @click="toDelMenu()" icon="el-icon-delete" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-divider></el-divider>

        <el-form-item label="当前菜单等级：">
          {{alertData.level}}
        </el-form-item>
        <el-form-item label="当前菜单名称：">
          {{alertData.name}}
        </el-form-item>
        <el-form-item label="当前菜单ID：">
          {{alertData.id}}
        </el-form-item>

        <el-form-item :hidden="addHidden" v-if="alertData.level!==4" label="新添加子菜单名称">
          <el-input v-model="menuForm.name"></el-input>
        </el-form-item>
        <el-form-item :hidden="addHidden" label="新添加菜单访问URL">
          <el-input  v-model="menuForm.url"></el-input>
        </el-form-item>
        <el-form-item :hidden="updateHidden" label="修改菜单名称">
          <el-input v-model="alertData.name"></el-input>
        </el-form-item>
        <el-form-item :hidden="updateHidden" label="修改菜单访问URL">
          <el-input v-model="alertData.url"></el-input>
        </el-form-item>
        <el-form-item :hidden="deleteHidden" label="">
          你确定删除此条数据吗？
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="save()">保存</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <span style="margin-left: 400px;">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText" style="width: 500px">
    </el-input>
    </span>

    <span style="margin-left: 400px;">
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      @node-click="handleNodeClick"
      :filter-node-method="filterNode"
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps">
    </el-tree>
    </span>

<!--    <el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
<!--    <el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
<!--    <el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
<!--    <el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
<!--    <el-button @click="resetChecked">清空</el-button>-->

  </div>

</template>

<script>
  export default {

    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    name: "menuManage",

    data() {
      return {
        data: [],
        defaultProps: {
          children: 'menuInfoList',
          label: 'name',
          id:'id'
        },
        tree:[],
        filterText: '',
        flag:false,
        alertData:{},
        addHidden:false,
        updateHidden:true,
        deleteHidden:true,
        menuForm:{}
      };
    },

    methods: {

      findAll:function(){
        this.$axios.post(this.domain.serverpath+'menu/listMenu').then((response)=>{
          this.data = response.data;
        }).catch(()=>{})
      },

      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
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

      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },

      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },



      filterNode(value, tree) {
        if (!value) return true;
        return tree.name.indexOf(value) !== -1;
      },

      handleNodeClick(tree){
        this.flag = true;
        this.alertData = tree;
        console.log(tree);
      },

      toDelMenu(){
        this.menuForm.status = 44;
        this.updateHidden=true;
        this.deleteHidden=false;
        this.addHidden=true;
      },

      toAdd(){
        this.menuForm={id:0};
        this.initCRUD();
      },

      toUpdate(){
        //this.menuForm = {};
        this.menuForm.id = this.alertData.id;
        this.alertData.name=this.alertData.name;
        this.alertData.url=this.alertData.url;
        this.updateHidden=false;
        this.deleteHidden=true;
        this.addHidden=true;
      },

      save(){

        let uri ;

        if(this.menuForm.id === 0){
          //add
          this.menuForm.id = this.alertData.id;
          this.menuForm.level = this.alertData.level;
          this.menuForm.parentId = this.alertData.id;
          uri = "menu/addMenu";
        }else if(this.menuForm.status === 44){
          //delete
          this.menuForm.id = this.alertData.id;
          uri = "menu/deleteMenu";
        }else if(this.menuForm.id > 0){
          //update
          this.menuForm = this.alertData;
          uri = "menu/updateMenu";
        }
        this.$axios.post(this.domain.serverpath+uri,this.menuForm).then((rese)=>{
          // console.log(rese.data);
          if(rese.data===0&&uri==="menu/deleteMenu"){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          }else if(rese.data!==0&&uri==="menu/deleteMenu"){
            this.$notify.error({
              title: '错误',
              message: '还有'+rese.data+'个角色！'
            });
          }else if(rese.data&&uri==="menu/addMenu"){
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          }else if(rese.data&&uri==="menu/updateMenu"){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          }
          this.findAll();
          this.flag = false;
        }).catch((response)=>{
          if(response.data===undefined){
            this.$notify.error({
              title: '错误',
              message: '您没有此项权限！'
            });
          }
          this.findAll();
          this.flag = false;
        })
      },

      close(){
        this.alertData = {};
        this.flag = false;
      },

      initCRUD(){
        if(this.alertData.level===4){
          this.updateHidden=false;
          this.deleteHidden=true;
          this.addHidden=true;
          this.toUpdate();
        }else {
          this.updateHidden=true;
          this.deleteHidden=true;
          this.addHidden=false;
        }
      },


    },

    mounted() {

      this.findAll();

    }

  }
</script>

<style scoped>

</style>
