<template>
  <div>
    <div id="sidebar">
      <div style="padding:1rem;">
        <!-- <div style="display:flex; justify-content:flex-end;">
          <div class="click" style="width:13px;height:13px;" @click="$router.push('/')">
            <img src="@/assets/home_icon.png" alt="" />
          </div>
        </div> -->
        <div style="font-weight:bold;">CHARACTERS</div>
        <div
          class="side-char"
          v-for="c in characters"
          :key="c"
          @click="goCharacter(c)"
          :style="{ 'font-weight': c === character ? 'bold' : 'normal' }"
        >
          {{ c }}
        </div>

        <div style="font-weight:bold; margin-top:20px;">SCENES</div>
        <div class="side-scene" v-for="s in scenes" :key="s" @click="goScene(s)">
          {{ s }}
        </div>

        <hr />

        <div class="created">
          <div>Created by</div>
          <div>
            <a href="https://www.zackstout.com">zackstout</a>
          </div>
        </div>
      </div>
    </div>

    <div id="main">
      <div class="click" style="width:15px;height:15px;" @click="$router.push('/')">
        <img src="@/assets/home_icon.png" alt="" />
      </div>

      <hr style="margin-bottom:0;" />

      <!-- <div class="header"> -->
      <h2>{{ character }}</h2>
      <!-- <div class="click" style="width:20px;height:20px;" @click="$router.push('/')">
          <img src="@/assets/home_icon.png" alt="" />
        </div> -->
      <!-- </div> -->
      <h3 class="click" style="font-style:italic; margin-bottom:30px; cursor:pointer;" @click="goPlay(play)">
        {{ playLabel }}
      </h3>

      <div class="ridges-container" style="margin-bottom:20px;"></div>

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
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
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

  @Watch("$route")
  routeChanged() {
    this.loadData();
  }

  loadData() {
    axios
      .get(`../../plays/${this.play}.json`) // tricky path difference
      .then((r) => {
        this.playData = r.data;
        const bd = getPlayBreakdown(this.playData);
        this.allSpeakers = bd.speakerAmts;
        const charInteractions = getCharacterInteractions(r.data);

        const totals = getInteractionTotals(charInteractions);

        runRidgelines(this.playData, 10, window.innerWidth - 400, 35, 0.6, bd.speakerAmts, this.character, {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        });

        runInteractions(
          totals.filter((t) => t.pair.includes(this.character)),
          bd.speakerAmts
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
.created {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.5rem;
}
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  opacity: 50%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

img {
  height: 100%;
  width: 100%;
}

.click:hover {
  opacity: 0.5;
}
</style>
