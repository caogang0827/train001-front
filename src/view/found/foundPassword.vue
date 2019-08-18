<template>
  <div style="width:100%;height: 100%;background-color: #bce8f1">

    <div style="height: 20px;width: 100%">

    </div>

    <h1 style="margin-left: 45%;font-family: Consolas;color: black">密码找回</h1>

    <div>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="第一步" description="输入邮箱地址"></el-step>
        <el-step title="第二步" description="重置密码"></el-step>
        <el-step title="第三步" description="成功找回"></el-step>
      </el-steps>
    </div>

    <div style="margin-top: 40px;width: 900px;height: 80px;margin-left: 33%">

      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic" v-if="flag1">
        <el-form-item
          prop="email"
          label="邮箱"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]"
        >
        <el-input v-model="dynamicValidateForm.email" style="width: 270px" :disabled="disabled1"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm1('dynamicValidateForm')" style="margin-left: 7%" :disabled="disabled2">确 定</el-button>
          <el-button type="danger" @click="resetForm1('dynamicValidateForm')">重 置</el-button>
        </el-form-item>
      </el-form>

<!--      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="flag2">-->
<!--        <el-form-item label="密码" prop="pass">-->
<!--          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 270px"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码" prop="checkPass">-->
<!--          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 270px"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitForm2('ruleForm')" style="margin-left: 7%">确 定</el-button>-->
<!--          <el-button type="danger" @click="resetForm2('ruleForm')">重 置</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->

    </div>

<!--    <h1 style="margin-left: 45%;font-family: Consolas" v-if="flag3">返回登录</h1>-->

  </div>
</template>

<script>
  export default {

    name: "foundPassword",

    data() {

      // var validatePass = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请输入密码'));
      //   } else {
      //     if (this.ruleForm.checkPass !== '') {
      //       this.$refs.ruleForm.validateField('checkPass');
      //     }
      //     callback();
      //   }
      // };
      //
      // var validatePass2 = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请再次输入密码'));
      //   } else if (value !== this.ruleForm.pass) {
      //     callback(new Error('两次输入密码不一致!'));
      //   } else {
      //     callback();
      //   }
      // };

      return {

        active: 0,

        flag1: true,

        disabled1: false,

        disabled2: false,

        // flag2: false,
        //
        // flag3: false,

        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        },

        // ruleForm: {
        //   pass: '',
        //   checkPass: '',
        // },
        //
        // rules: {
        //   pass: [
        //     { validator: validatePass, trigger: 'blur' }
        //   ],
        //   checkPass: [
        //     { validator: validatePass2, trigger: 'blur' }
        //   ],
        // },

      };

    },

    methods: {

      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('发送邮件!');
            this.$axios.post(this.domain.ssoserverpath+"sendEmail?email="+this.dynamicValidateForm.email).then((response)=>{
              if(response.data.code===404){
                this.$message({
                  message: '用户不存在！',
                  center: true,
                  type: 'error'
                });
                this.resetForm1(formName);
              }else if(response.data.code===200){
                console.log(response.data.result.id);
                this.Cookies.set("userId",response.data.result.id);
                this.$message({
                  message: '邮件发送成功！',
                  center: true,
                  type: 'success'
                });
                this.active = 1;
                this.disabled1 = true;
                this.disabled2 = true;
              }else if(response.data.code===500){
                this.$message({
                  message: '邮件发送失败！！',
                  center: true,
                  type: 'error'
                });
                this.resetForm1(formName);
              }
            }).catch(()=>{});
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      resetForm1(formName) {
        this.$refs[formName].resetFields();
        this.disabled1 = false;
        this.disabled2 = false;
      },

      // submitForm2(formName) {
      //   this.$refs[formName].validate((valid) => {
      //     if (valid) {
      //       alert('submit!');
      //       this.active = 2;
      //       this.flag2 = false;
      //       this.flag3 = true;
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // },
      //
      // resetForm2(formName) {
      //   this.$refs[formName].resetFields();
      // }

    }

  }
</script>

<style scoped>

</style>
