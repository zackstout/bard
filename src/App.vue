<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/*
NOTES: If play or character or whatever is not in list, need to show "404" page

[x] TODO: Fill interactions chart with real colors

[x] TODO: Get curves back

figure outhow to share data (char colors)...
Feels like need to pass in to runRidgelines, at the least. Butneed to do more...
Scene needs to recompute or know about playBreakdown, to get speakerAmts...
Maybe browser cache is smart enough to handle it?

Clean up data stuff

[x] TODO: Add character colors! (maybe text shadow to lines??)

TODO: How to get hover on interactions chart to communicate to Ridges chart??

Fix width of clickable items

TODO: Add character view

TODO: Add "piecharts"

TODO: Search!!

[x] TODO: Filter by speech length....within a play? Across all plays?

TODO: show interactions....relationships....punctuation habits....speech percentages....
*/

@Component({})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  user-select: none;
  color: #2c3e50;
  padding: 1rem;
  overflow: hidden;
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

/* .area {
  fill: #448cab;
}

.activity:nth-child(odd) .area {
  fill: #5ca3c1;
} */

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
