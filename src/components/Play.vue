<template>
  <div>
    <h2>{{ playLabel }}</h2>

    <div>
      <h3>Characters</h3>
      <div v-for="char in characters" :key="char" @click="goCharacter(char)">{{ char }}</div>
    </div>

    <div>
      <h3>Scenes</h3>
      <div v-for="scene in scenes" :key="scene" @click="goScene(scene)">{{ scene }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { plays, getPlayBreakdown } from "@/utils";

import axios from "axios";

// import macbeth from "@/assets/macbeth.json";
// import { allPlays } from "@/components/allPlays";

import * as d3 from "d3";

@Component
export default class Play extends Vue {
  @Prop() private play!: string;

  playData: any = [];

  // @Watch("$route")
  // routeChange() {
  //   console.log("route change");
  //   this.loadData();
  // }

  loadData() {
    axios
      .get(`./plays/${this.play}.json`)
      .then((r) => {
        this.playData = r.data;

        // const bd = getPlayBreakdown(r.data);
        // console.log("bd", bd, r.data);
      })
      .catch((e) => console.error("e", e));

    // d3.json(`./plays/${this.play}.json`, (err: any, data: any[]) => {
    //   if (err) throw Error;
    //   console.log("data....", data);
    //   this.playData = data;
    // });
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

  // get playData(): any[] {
  //   return allPlays[this.play];
  // }

  mounted() {
    this.loadData();
    // console.log("the play...", allPlays[this.play]);
    // console.log(`@/components/output/${this.play}.json`);
    // d3.json(`@/assets/${this.play}.json`, function(error: any, dataFlat: any) {
    //   if (error) throw error;
    //   console.log("got it", dataFlat);
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
    // });
  }

  //   msg = "hello" + this.$route.params.play;

  goCharacter(name: string) {
    this.$router.push(`/${this.play}/characters/${name}`);
  }

  goScene(scene: string) {
    this.$router.push(`/${this.play}/${scene}`);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
