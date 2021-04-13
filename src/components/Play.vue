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
      <h2 style="text-align:center;">{{ playLabel }}</h2>

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
      </div>

      <div class="line"></div>

      <!-- 
      <div class="chart-container">
        <h3>Speeches by Length</h3>
        <div class="linegroups-container"></div>
      </div>
      <div class="line"></div> -->

      <div>
        <div class="chart-container">
          <h3>Speeches</h3>

          <div style="display:flex;">
            <span style="margin-right:3px;">Minimum length:</span>
            <select v-model="minLengthSelectOption">
              <option v-for="opt in minLengthSelectOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </div>

          <div style="font-style:italic; margin-top:10px;">Results: {{ speeches.length }}</div>
        </div>

        <div>
          <div v-for="(speech, i) in speeches" :key="i" style="margin-top:20px;">
            <div style="font-weight:bold;">{{ speech.title }}</div>
            <div>
              {{ speech.data.speaker }} <span style="font-style:italic;">({{ speech.data.lines.length }} lines)</span>
            </div>

            <div>
              <div v-for="(line, i) in speech.data.lines" :key="i" :style="getLineStyle(speech.data.speaker)">
                {{ line }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EVENTS, EventBus } from "@/EventBus";
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
  runLinegroups,
  groupLinesByNumber,
} from "@/utils";

import axios from "axios";
import * as d3 from "d3";

@Component
export default class Play extends Vue {
  @Prop() private play!: string;

  minLengthSelectOptions = [5, 10, 15, 20, 25, 30];
  minLengthSelectOption = 20;

  playData: any = [];

  allSpeakers: any = [];

  mounted() {
    this.loadData();

    EventBus.$on(EVENTS.CLICK_SCENE, (scene: string) => {
      this.goScene(scene);
    });

    EventBus.$on(EVENTS.CLICK_SPEAKER, (speaker: string) => {
      this.goCharacter(speaker);
    });
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

        this.allSpeakers = bd.speakerAmts;

        // TODO: Don't like this magic number (related to marginLeft of ridgelines)
        runRidgelines(this.playData, 10, window.innerWidth - 300, 500, 0.6, bd.speakerAmts);

        const charInteractions = getCharacterInteractions(r.data);
        const totals = getInteractionTotals(charInteractions);

        const chartWidth = (window.innerWidth - 400) / 2;
        const chartHeight = 300;

        runInteractions(totals.slice(0, 10), bd.speakerAmts, chartWidth, chartHeight);

        runCharacters(bd, chartWidth - 25, chartHeight);

        runPiecharts(this.playData, bd.speakerAmts, window.innerWidth - 200, 400);

        // runLinegroups(groupLinesByNumber(this.playData), window.innerWidth - 250, 400);

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

  getLineStyle(speaker: string) {
    const charIdx = this.allSpeakers.findIndex((s: any) => s.speaker === speaker);
    const col = getCharColor(charIdx);

    return {
      textShadow: `1px 1px 5px ${col}`,
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
