<template>
  <div>
    <div id="sidebar">
      <div style="padding:1rem;">
        <div style="font-weight:bold;">CHARACTERS</div>
        <div class="side-char" v-for="c in characters" :key="c" @click="goCharacter(c)">
          {{ c }}
        </div>

        <div style="font-weight:bold; margin-top:20px;">SCENES</div>
        <div class="side-scene" v-for="s in scenes" :key="s" @click="goScene(s)">
          {{ s }}
        </div>
      </div>
    </div>

    <div id="main">
      <h2>{{ character }}</h2>
      <h3 style="font-style:italic; margin-bottom:30px; cursor:pointer;" @click="goPlay(play)">{{ playLabel }}</h3>

      <div class="interactions-container"></div>

      <!-- copy from Play.vue: -->
      <div>
        <div v-for="(speech, i) in speechesOfCharacter" :key="i" style="margin-top:20px;">
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import {
  getPlayBreakdown,
  runRidgelines,
  getCharacterInteractions,
  getInteractionTotals,
  runInteractions,
  getSpeeches,
  getCharColor,
  plays,
} from "@/utils";

@Component
export default class Character extends Vue {
  @Prop() private character!: string;

  playData: any[] = [];
  allSpeakers: any[] = [];

  mounted() {
    console.log("mount", this.character);
    this.loadData();
  }

  loadData() {
    axios
      .get(`../../plays/${this.play}.json`)
      .then((r) => {
        this.playData = r.data;
        const bd = getPlayBreakdown(this.playData);
        this.allSpeakers = bd.speakerAmts;
        const charInteractions = getCharacterInteractions(r.data);

        // TODO: filter by character
        const totals = getInteractionTotals(charInteractions);

        runInteractions(
          totals.slice(0, 10),
          bd.speakerAmts
          // .filter((s) => s.speaker === this.character)
        );
      })
      .catch((e) => console.error("e", e));
  }

  get play() {
    return this.$route.params.play;
  }

  get playLabel() {
    return plays.find((p) => p.value === this.play)?.label;
  }

  get speechesOfCharacter() {
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
      .filter((speech: any) => speech.data.speaker === this.character);
  }

  get characters() {
    return this.allSpeakers.map((s) => s.speaker);
  }

  get scenes() {
    return this.playData.map((s) => s.title);
  }

  // copying from Play.vue

  getLineStyle(speaker: string) {
    const charIdx = this.allSpeakers.findIndex((s: any) => s.speaker === speaker);
    const col = getCharColor(charIdx);

    return {
      textShadow: `1px 1px 5px ${col}`,
    };
  }

  // copying from Play.vue

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
/* Just copying from Play */
#sidebar {
  width: 250px;
  height: 100%;
  background: rgb(235, 235, 235);
  position: fixed;
  top: 0;
  left: 0;
  overflow: scroll;
}

#main {
  width: calc(100% - 250px - 2rem);
  position: absolute;
  top: 0;
  left: 250px;
  padding: 1rem;
  overflow: hidden;
}

.side-char,
.side-scene {
  font-size: 12px;
  cursor: pointer;
}

.side-char:hover {
  opacity: 0.5;
}
.side-scene:hover {
  opacity: 0.5;
}
</style>
