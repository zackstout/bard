<template>
  <div>
    <h2 class="click" @click="goPlay(play)">{{ playLabel }}</h2>

    <div class="ridges-container"></div>

    <h3>
      <span v-if="sceneIdx !== 0" class="click" @click="goScene(prevScene)">←</span>
      <span style="margin:0 1rem;">Act {{ actNum }}, Scene {{ sceneNum }}</span>
      <span v-if="sceneIdx !== allScenes.length - 1" class="click" @click="goScene(nextScene)">→</span>
    </h3>

    <div>
      <div class="click" v-for="char in characters" :key="char" :style="getCharStyle(char)" @click="goCharacter(char)">
        {{ char }}
      </div>
    </div>

    <div>
      <div v-for="(line, j) in sceneData.lines" :key="j" :style="getLineStyle(line)">
        {{ line.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { plays, getSceneBreakdown, runRidgelines, getPlayBreakdown, getCharColor } from "@/utils";
import axios from "axios";

@Component
export default class Scene extends Vue {
  @Prop() private scene!: string;

  sceneData: any = [];

  sceneNum = "0";
  actNum = "0";

  allScenes: string[] = [];
  sceneIdx = -1;

  allSpeakers: any[] = [];

  @Watch("$route")
  routeChanged() {
    this.loadData();
  }

  mounted() {
    this.loadData();
  }

  getCharStyle(char: string) {
    const charIdx = this.allSpeakers.findIndex((s) => s.speaker === char);
    const col = getCharColor(charIdx);
    return {
      color: col,
    };
  }

  loadData() {
    axios
      .get(`../plays/${this.play}.json`)
      .then((r) => {
        const [a, s] = this.scene.split(".");
        this.actNum = a;
        this.sceneNum = s;
        this.sceneData = r.data.find((scene: any) => scene.title === this.scene);
        this.allScenes = r.data.map((scene: any) => scene.title);
        this.sceneIdx = r.data.findIndex((scene: any) => scene.title === this.scene);

        const bd = getPlayBreakdown(r.data);
        this.allSpeakers = bd.speakerAmts;

        // NOTE: Prob doesn't need to be so large
        runRidgelines([this.sceneData], 2, window.innerWidth, 400, 0.6, bd.speakerAmts);
      })
      .catch((e) => console.error("e", e));
  }

  getLineStyle(line: any) {
    const charIdx = this.allSpeakers.findIndex((s) => s.speaker === line.speaker);
    const col = getCharColor(charIdx);

    if (line.type === "speech") {
      return {
        fontWeight: "bold",
        marginTop: "25px",
        color: col,
      };
    } else {
      return {
        textShadow: `1px 1px 5px ${col}`,
      };
    }
  }

  get nextScene() {
    return this.allScenes[this.sceneIdx + 1];
  }

  get prevScene() {
    return this.allScenes[this.sceneIdx - 1];
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
