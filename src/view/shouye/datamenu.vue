<template>
  <div style="background-color:#545c64;">

    <el-menu ref="emenu"
             default-active="2"
             class="el-menu-vertical-demo"
             :collapse="isCollapse"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
    >

      <el-submenu
        :title="getMenuName(m1.name)"
        v-for="(m1,mindex) in listMenu" :key="mindex"
        :index="getIndex(m1.id)">

        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">{{m1.name}}</span>
        </template>

        <div v-for="(m2,m2Index) in m1.menuInfoList" :key="m2Index">

          <el-submenu v-if="m2.menuInfoList!=null&&m2.menuInfoList.length > 0"
                      :index="getIndex(m2.parentId)+'-'+getIndex(m2.id)">

            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">{{m2.name}}</span>
            </template>

            <el-menu-item @click="toforPath(m3.url)" v-for="(m3,m3Index) in m2.menuInfoList" :key="m3Index"
                          :index="getIndex(m2.parentId)+'-'+getIndex(m3.parentId)+'-'+getIndex(m3.id)">

              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">{{m3.name}}</span>
              </template>

            </el-menu-item>

          </el-submenu>

          <el-menu-item v-else @click="toforPath(m2.url)" :index="getIndex(m2.parentId)+'-'+getIndex(m2.id)">

            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">{{m2.name}}</span>
            </template>

          </el-menu-item>

        </div>

      </el-submenu>

    </el-menu>

  </div>
</template>

<script>
  export default {
    name: "datamenu",
    data() {
      return {
        isCollapse: true,
        wheight: window.innerHeight,
        listMenu: this.$store.state.userInfo.menuInfoList
      }
    },
    methods: {
      openClose() {
        if (this.$refs.emenu.collapse) {
          this.$data.isCollapse = false;
          //调用父组件的方法，更改变量值
          this.$emit("ee", false)

        } else {
          this.$data.isCollapse = true;
          //调用父组件的方法，更改变量值
          this.$emit("ee", true)

        }
      },
      getIndex(index) {
        return '' + index.toString();
      },
      getMenuName(menuName) {
        return menuName;
      },
      toforPath(url) {
        if (url != null) {
          //进入对应的路由
          this.$router.push({path: url})
        } else {
          this.$router.push({path: '/system'})
        }

      }

    },
    mounted() {
    }
  }
</script>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .el-menu {
    border-right: 0px;
  }
</style>
