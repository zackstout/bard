<template>
  <div>
    <div id="sidebar">
      <div style="padding:1rem;">
        <div style="font-weight:bold;">CHARACTERS</div>
        <div class="side-char" v-for="c in allCharacters" :key="c" @click="goCharacter(c)">
          {{ c }}
        </div>

        <div style="font-weight:bold; margin-top:20px;">SCENES</div>
        <div
          class="side-scene"
          v-for="s in allScenes"
          :key="s"
          @click="goScene(s)"
          :style="{ 'font-weight': s === scene ? 'bold' : 'normal' }"
        >
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
      <h2>
        <span v-if="sceneIdx !== 0" class="click" @click="goScene(prevScene)">←</span>
        <span style="margin:0 1rem;">Act {{ actNum }}, Scene {{ sceneNum }}</span>
        <span v-if="sceneIdx !== allScenes.length - 1" class="click" @click="goScene(nextScene)">→</span>
      </h2>
      <!-- 
        <div class="click" style="width:20px;height:20px;" @click="$router.push('/')">
          <img src="@/assets/home_icon.png" alt="" />
        </div> -->
      <!-- </div> -->

      <div class="scenepie-container"></div>

      <h3 style="font-style:italic;" class="click" @click="goPlay(play)">{{ playLabel }}</h3>

      <div class="ridges-container"></div>

      <div>
        <div
          class="click"
          v-for="char in characters"
          :key="char"
          :style="getCharStyle(char)"
          @click="goCharacter(char)"
        >
          {{ char }}
        </div>
      </div>

      <div>
        <div v-for="(line, j) in sceneData.lines" :key="j" :style="getLineStyle(line)">
          {{ line.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { plays, getSceneBreakdown, runRidgelines, getPlayBreakdown, getCharColor, runScenePie } from "@/utils";
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
        runRidgelines([this.sceneData], 2, window.innerWidth - 375, 250, 0.6, bd.speakerAmts);

        runScenePie(r.data, this.scene, 50, 50);
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

  get allCharacters() {
    return this.allSpeakers.map((s) => s.speaker);
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

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  opacity: 50%;
}
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
