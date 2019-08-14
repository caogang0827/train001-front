<template>
  <div style="width:100%;height: 100%;">
      <el-container style="height: 100%" direction="vertical">
        <el-header style="font-size: 20px;text-align: left">

          <span style="font-size:25px;margin-right:60%;">
            晓刚平台
            <el-tooltip ref="tip" class="item" effect="dark"  placement="top-start" :content="content">
              <i class="el-icon-menu" @click="openParentClose"></i>
            </el-tooltip>

          <div style="float:right">
            <el-dropdown @command="handleCommand">
              <i class="el-icon-setting" style="margin-right: 15px"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="c">首页</el-dropdown-item>
                <el-dropdown-item command="a">查看</el-dropdown-item>
                <el-dropdown-item command="b">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span ref="userinfo_username">{{username}}</span>
            <input ref="userinfo_userid" type="hidden" v-model="userid">
            &nbsp;&nbsp;&nbsp;
            <el-dropdown trigger="click" >
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix">
                  评论
                  <el-badge class="mark" :value="12" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>


        </span>
        </el-header>

        <el-container noresize:false>
          <!-- 左侧的菜单 -->
          <mymenu  ref="iiii" v-on:ee="updatePro"></mymenu>
          <!-- 右侧的主显示区域 -->
          <mymain style="padding:0px"></mymain>

        </el-container>

      </el-container>

    <el-dialog
      title="当前用户信息"
      :visible.sync="dialog1Visible"
      width="40%"
    >
      <el-form  :inline="true" label-width="100px" class="demo-form-inline">
        <el-form-item label="用户名:">{{this.$store.state.userInfo.userName}}</el-form-item>
        <el-form-item label="登录名:">{{this.$store.state.userInfo.loginName}}</el-form-item>
        <el-form-item label="性别:">{{this.$store.state.userInfo.sex===1?'男':'女'}}</el-form-item>
        <br>
        <el-form-item label="电话:">{{this.$store.state.userInfo.tel}}</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
      </span>
    </el-dialog>




    <!-- 提示音 -->
    <audio id="yinpin" src="../../static/tishi/tishiyin.mp3"></audio>
    <audio id="en" src="../../static/tishi/en.mp3"></audio>
    <audio id="qingsong" src="../../static/tishi/qingsong.mp3"></audio>
    <audio id="aiya" src="../../static/tishi/aiya.mp3"></audio>
  </div>


</template>

<script>

  import mymenu from './datamenu.vue'
  import mymain from './datamain.vue'

  export default {

    name: "index",

    components:{mymenu,mymain},

    data(){
      return{
        content:"点击打开菜单",
        dialogVisible: false,
        dialog1Visible: false,
        userid:"",
        username:"",
        currInfo:{
        },
      }
    },

    mounted() {
      //登录之后音乐提示
      this.playAudio("yinpin", "yinpin");
      this.username =  this.$store.state.userInfo.username;
    },

    methods:{

      //左侧菜单显示或隐藏
      openParentClose:function () {
        this.$refs.iiii.openClose();
      },

      handleCommand:function (data) {
        if(data==="a"){//用户信息展示
          this.dialog1Visible = true;
        }else if(data==="b"){//退出操作
          if(confirm("确认退出？")){
            this.$router.push('/');
            this.$store.state.token = "";
          }
        }else if(data==="c"){//首页

        }
      },

      updatePro(uu){
        if(uu){
          this.$data.content="点击打开菜单";
        }else{
          this.$data.content="点击关闭菜单";
        }
      },


    }



  }

</script>

<style scoped>
  .el-header {
    background-color: #409EFF;
    color: #333;
    line-height:60px;

  }

  .el-aside {
    color: #333;
    height: 100%;
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
