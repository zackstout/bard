<template>
  <div>
    <h2>{{ playLabel }}</h2>
    <h3>Act {{ actNum }}, Scene {{ sceneNum }}</h3>

    <div>
      <div v-for="char in characters" :key="char">{{ char }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { plays, getSceneBreakdown } from "@/utils";
import axios from "axios";

@Component
export default class Scene extends Vue {
  @Prop() private scene!: string;

  sceneData: any = [];

  sceneNum = "0";
  actNum = "0";

  loadData() {
    axios
      .get(`../plays/${this.play}.json`)
      .then((r) => {
        this.sceneData = r.data.find((scene: any) => scene.title === this.scene);
        // const sb = getSceneBreakdown(this.sceneData);
        // console.log("sb", sb);
      })
      .catch((e) => console.error("e", e));
  }

  mounted() {
    const [a, s] = this.scene.split(".");
    this.actNum = a;
    this.sceneNum = s;

    this.loadData();
  }

  get characters() {
    const bd = getSceneBreakdown(this.sceneData);
    // console.log("bd", bd, r.data);
    return bd.speakerAmts.map((s) => s.speaker);
  }

  get play() {
    return this.$route.params.play;
  }

  get playLabel() {
    return plays.find((p) => p.value === this.play)?.label;
  }
}
</script>
