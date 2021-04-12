<template>
  <div style="overflow:hidden;">
    <div id="sidebar">
      <div style="padding:1rem;">
        <div
          :style="{ 'font-weight': play === p.value ? 'bold' : '' }"
          class="side-play"
          v-for="p in plays"
          :key="p.value"
          @click="goPlay(p.value)"
        >
          {{ p.label }}
        </div>
      </div>
    </div>

    <div id="main">
      <h2>{{ playLabel }}</h2>

      <div class="ridges-container"></div>

      <div class="line"></div>

      <div class="charts-container">
        <div class="chart-container">
          <h3>Characters</h3>
          <div class="characters-container"></div>
        </div>

        <div>
          <div class="chart-container">
            <h3>Interactions</h3>

            <div class="interactions-container"></div>
          </div>
        </div>
      </div>

      <div class="line"></div>

      <div class="chart-container">
        <h3>Scenes</h3>

        <div class="pie-container"></div>
        <!-- <div class="click" v-for="scene in scenes" :key="scene" @click="goScene(scene)">{{ scene }}</div> -->
      </div>

      <div class="line"></div>

      <div>
        <h3>Speeches</h3>
        <span style="margin-right:3px;">Minimum length:</span>
        <select v-model="minLengthSelectOption">
          <option v-for="opt in minLengthSelectOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <div>
          <div v-for="(speech, i) in speeches" :key="i" style="margin-top:20px;">
            <div style="font-weight:bold;">{{ speech.title }}</div>
            <div>
              {{ speech.data.speaker }} <span style="font-style:italic;">({{ speech.data.lines.length }} lines)</span>
            </div>

            <div>
              <div v-for="(line, i) in speech.data.lines" :key="i">{{ line }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  plays,
  getPlayBreakdown,
  runRidgelines,
  getCharColor,
  getSpeeches,
  getCharacterInteractions,
  getInteractionTotals,
  runInteractions,
  runCharacters,
  getTotalMarks,
  runPiecharts,
} from "@/utils";

import axios from "axios";
import * as d3 from "d3";

@Component
export default class Play extends Vue {
  @Prop() private play!: string;

  minLengthSelectOptions = [5, 10, 15, 20, 25, 30];
  minLengthSelectOption = 20;

  playData: any = [];

  mounted() {
    this.loadData();
  }

  @Watch("$route")
  routeChanged() {
    this.loadData();
  }

  loadData() {
    axios
      .get(`./plays/${this.play}.json`)
      .then((r) => {
        this.playData = r.data;
        const bd = getPlayBreakdown(this.playData);

        // TODO: Don't like this magic number (related to marginLeft of ridgelines)
        runRidgelines(this.playData, 10, window.innerWidth - 300, 500, 0.6, bd.speakerAmts);

        const charInteractions = getCharacterInteractions(r.data);
        const totals = getInteractionTotals(charInteractions);

        const chartWidth = (window.innerWidth - 400) / 2;
        const chartHeight = 300;

        runInteractions(totals.slice(0, 10), bd.speakerAmts, chartWidth, chartHeight);

        runCharacters(bd, chartWidth - 25, chartHeight);

        runPiecharts(this.playData, bd.speakerAmts, window.innerWidth - 200, 400);

        // const qmarks = getTotalMarks(this.playData, "?");
        // console.log("qmarks", qmarks, (100 * qmarks.total) / qmarks.allChars);
      })
      .catch((e) => console.error("e", e));
  }

  get plays() {
    return plays;
  }

  get speeches() {
    const speeches = this.getSpeechesOfMinLength(this.minLengthSelectOption);
    // console.log("speeches:", speeches);
    return speeches;
  }

  get playLabel() {
    return plays.find((p) => p.value === this.play)?.label;
  }

  get characters() {
    const bd = getPlayBreakdown(this.playData);
    // console.log("bd", bd, r.data);
    return bd.speakerAmts.map((s) => s.speaker);
  }

  get scenes() {
    return this.playData.map((scene: any) => scene.title);
  }

  getSpeechesOfMinLength(n: number) {
    return this.playData
      .reduce((acc: any[], scene: any) => {
        const speeches = getSpeeches(scene).map((s) => {
          return { data: s, title: scene.title };
        });
        return [
          //@ts-ignore
          ...acc,
          ...speeches,
        ];
      }, [])
      .filter((speech: any) => speech.data.lines.length >= n);
  }

  getCharStyle(charIdx: number) {
    const col = getCharColor(charIdx);
    return {
      color: col,
    };
  }

  goCharacter(name: string) {
    this.$router.push(`/${this.play}/characters/${name}`);
  }

  goScene(scene: string) {
    this.$router.push(`/${this.play}/${scene}`);
  }

  goPlay(play: string) {
    this.$router.push(`/${play}`);
  }
}
</script>

<style scoped>
#sidebar {
  width: 150px;
  height: 100%;
  background: rgb(235, 235, 235);
  position: fixed;
  top: 0;
  left: 0;
  /* padding: 1rem; */
}

#main {
  width: calc(100% - 150px - 2rem);
  position: absolute;
  top: 0;
  left: 150px;
  padding: 1rem;
  overflow: hidden;
}

.charts-container {
  display: flex;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
}

.side-play {
  margin: 8px 0;
  cursor: pointer;
}

.side-play:hover {
  opacity: 0.5;
}

.line {
  height: 1px;
  width: 100%;

  background: lightgray;
}

/* .pie-container .axis .domain {
  display: block;
} */
</style>
