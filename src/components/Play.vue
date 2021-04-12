<template>
  <div style="overflow:hidden;">
    <div id="sidebar"></div>

    <div id="main">
      <h2>{{ playLabel }}</h2>

      <div class="ridges-container"></div>

      <!-- <div>
      <h3>Characters</h3>
      <div
        class="click"
        v-for="(char, i) in characters"
        :key="char"
        @click="goCharacter(char)"
        :style="getCharStyle(i)"
      >
        {{ char }}
      </div>
    </div> -->

      <div>
        <h3>Interactions</h3>

        <div class="interactions-container"></div>
      </div>

      <div>
        <h3>Scenes</h3>
        <div class="click" v-for="scene in scenes" :key="scene" @click="goScene(scene)">{{ scene }}</div>
      </div>

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
} from "@/utils";

import axios from "axios";
import * as d3 from "d3";

@Component
export default class Play extends Vue {
  @Prop() private play!: string;

  minLengthSelectOptions = [5, 10, 15, 20, 25, 30];
  minLengthSelectOption = 20;

  playData: any = [];

  loadData() {
    axios
      .get(`./plays/${this.play}.json`)
      .then((r) => {
        this.playData = r.data;
        const bd = getPlayBreakdown(this.playData);

        // TODO: Don't like this magic number (related to marginLeft of ridgelines)
        runRidgelines(this.playData, 10, window.innerWidth - 300, 500, 0.6, bd.speakerAmts);

        const charInteractions = getCharacterInteractions(r.data);
        // console.log("ints", charInteractions);
        const totals = getInteractionTotals(charInteractions);
        // console.log("totals", totals);

        runInteractions(totals.slice(0, 10), bd.speakerAmts, window.innerWidth - 150, 200);
      })
      .catch((e) => console.error("e", e));
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

  mounted() {
    this.loadData();

    //   // const speeches = getSpeeches(dataFlat[1]);
    //   // console.log("speeches", speeches);
    //   //   const charInteractions = getCharacterInteractions(dataFlat);
    //   //   console.log("ints", charInteractions);
    //   //   const totals = getInteractionTotals(charInteractions);
    //   //   console.log("tots", totals);
    //   //   // const breakdown = getSceneBreakdown(dataFlat[0]);
    //   //   // console.log("bd", breakdown);
    //   //   const playBreakdown = getPlayBreakdown(dataFlat);
    //   //   console.log("play bd", playBreakdown);
    //   //   // const spkrs = getLinesBySpeakerByScene(dataFlat);
    //   //   const spkrs3 = getLinesBySpeakerByChunk(dataFlat, chunkSize);
  }

  goCharacter(name: string) {
    this.$router.push(`/${this.play}/characters/${name}`);
  }

  goScene(scene: string) {
    this.$router.push(`/${this.play}/${scene}`);
  }
}
</script>

<style scoped>
#sidebar {
  width: 150px;
  height: 100%;
  background: lightblue;
  position: fixed;
  top: 0;
  left: 0;
}

#main {
  width: calc(100% - 150px - 2rem);
  position: absolute;
  top: 0;
  left: 150px;
  padding: 1rem;
  overflow: hidden;
}
</style>
