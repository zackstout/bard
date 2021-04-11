<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" /> -->

    <router-view> </router-view>

    <!-- <div v-for="(scene, i) in macbeth" :key="i" style="margin-bottom:100px;">
      <div>{{ scene.title }}</div>
      <div v-for="(line, j) in scene.lines" :key="j" :style="getStyle(line)">
        {{ line.value }}
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from "./components/HelloWorld.vue";
// @ts-ignore
// import macbeth from "./output/macbeth.json";

/*
NOTES: If play or character or whatever is not in list, need to show "404" page

*/

@Component({
  components: {
    // HelloWorld,
  },
})
export default class App extends Vue {
  // mounted() {
  //   console.log("mac", macbeth);
  // }

  // get macbeth() {
  //   return macbeth;
  // }

  getStyle(line: any) {
    if (line.type === "speech") {
      return { fontWeight: "bold", marginTop: "25px" };
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
