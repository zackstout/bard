<template>
  <div>
    <h2>{{ playLabel }}</h2>

    <div class="ridges-container"></div>

    <div>
      <h3>Characters</h3>
      <div class="click" v-for="char in characters" :key="char" @click="goCharacter(char)">{{ char }}</div>
    </div>

    <div>
      <h3>Scenes</h3>
      <div class="click" v-for="scene in scenes" :key="scene" @click="goScene(scene)">{{ scene }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { plays, getPlayBreakdown, runRidgelines } from "@/utils";

import axios from "axios";
import * as d3 from "d3";

@Component
export default class Play extends Vue {
  @Prop() private play!: string;

  playData: any = [];

  loadData() {
    axios
      .get(`./plays/${this.play}.json`)
      .then((r) => {
        this.playData = r.data;
        runRidgelines(this.playData, 10, window.innerWidth, 600);
      })
      .catch((e) => console.error("e", e));
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
