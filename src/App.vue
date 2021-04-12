<template>
  <div id="app">
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

/*
NOTES: If play or character or whatever is not in list, need to show "404" page

*/

@Component({})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;

  color: #2c3e50;
  padding: 1rem;
}

.click {
  cursor: pointer;
}
.click:hover {
  color: aqua;
}

svg {
  display: block;
  margin: 0 auto;
}

.axis .domain {
  display: none;
}

.axis--x text {
  fill: #999;
}

.axis text {
  fill: black !important;
}

.axis--x line {
  stroke: #aaa;
}

.axis--activity .tick line {
  display: none;
}

.axis--activity text {
  font-size: 10px;
  fill: #777;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  cursor: pointer;
}

.axis--activity .tick:nth-child(odd) text {
  fill: #222;
}

.line {
  fill: none;
  stroke: #fff;
}

.area {
  fill: #448cab;
}

.activity:nth-child(odd) .area {
  fill: #5ca3c1;
}

.activity:nth-child(odd) .area.active {
  fill: gold;
}

.area.active {
  fill: gold;
}

.space-y {
  margin-bottom: 10px;
}

.bold {
  font-weight: bold;
  margin: 5px 0;

  font-size: 1.8rem;
}
</style>
