<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/*
NOTES: If play or character or whatever is not in list, need to show "404" page

[ ] scene arrows should cycle back/forward. the plays end where they begin.

[ ] use tailwind!


[ ] TODO: Add character view


[ ] Clean up all hover/click

[ ] Add all click/routing behavior


[ ] make "speeches" component (Play and Character....and Scene)

[ ] relationships! (Must be added manually....)

[ ] turn off text shadow...in general, style combos dropdown

[ ] TODO: Search!! ACROSS ALL PLAYS, from home

[ ] Navigation duplicated issue
(looks like emmpty catch after router.push should silence the error)

[ ] filter by speaker/all in play/Speeches

[ ] line numbers?

[ ] Checkboxes to show/hide graphs 
(bc want to have highlight behavior on one affect others)

[ ] Clean up chart margin weirdness (number of things...Height of first one overflowing top....stuff going off to right...)


[ ] Find 20 visibly distinct colors

[ ] Hmm...brutus_lucius interaction rate looks way too high...
[ ] "ROSENCRANTZ:"

[ ] Clean up data stuff
Like...Do we ever want to save data? In the json? Or just chill for now

[ ] Sorting

[ ] Expose other options (curve type e.g.)


[x] TODO: Add character colors! (maybe text shadow to lines??)
[x] TODO: Filter by speech length....within a play? Across all plays?
[x] TODO: Fill interactions chart with real colors
[x] TODO: Get curves back
[x] TODO: Add "piecharts"
[x] added click scene "pie chart"
[x] Another vis idea: number of lines per speech in a play....just a bar graph I guess
Kind of a histogram I guess
Eh, it's not actually that cool
[x] why isn't basic alphabetical sorting of plays working?
[x] TODO: How to get hover on interactions chart to communicate to Ridges chart??
=> Need EVENTBUS!
figure outhow to share data (char colors)...
Feels like need to pass in to runRidgelines, at the least. Butneed to do more...
Scene needs to recompute or know about playBreakdown, to get speakerAmts...
Maybe browser cache is smart enough to handle it?

[x] Represent in scene: numlines, percent of play
Ooooh maybe like a clock that shows a sliver, and where in play it is. I like that.

[x] add sidebar to Scene (and char) view

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
  /* margin: 0 auto; */
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
