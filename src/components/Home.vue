<template>
  <div>
    <h2>Explore the Bard</h2>

    <div style="display:flex;">
      <div style="width:200px;">
        <div v-for="play in plays" :key="play.value" @click="goPlay(play.value)" class="play">
          {{ play.label }}
        </div>
      </div>

      <div style="flex-grow:1; height:500px; padding-left:4rem; overflow:scroll;">
        <input v-model="searchText" type="text" placeholder="Search" />
        <button style="margin-left:2pt;" @click="search">Go</button>

        <div style="margin:1rem 0; font-style:italic;">Total results: {{ searchResults.length }}</div>

        <div>
          <div v-for="(r, i) in searchResults" :key="i" style="margin-bottom:1.5rem;">
            <div>{{ r.play }}, {{ r.scene }}</div>
            <div>
              {{ r.speaker }}: <span>{{ r.text }}</span>
            </div>
            <!-- <div>{{ r.text }}</div> -->
          </div>
        </div>
      </div>
    </div>

    <hr style="margin:60px 0 20px 0;" />

    <div class="created">
      <div>Created by</div>
      <div>
        <a href="https://www.zackstout.com">zackstout</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import { plays } from "@/utils";

// Be nice to emphasize the target word in each searchResult (italic?)

@Component
export default class Play extends Vue {
  plays = plays;

  searchText = "";

  allPlayText: any[] = [];

  // should have play, scene, speaker, and text
  searchResults: any[] = [];

  mounted() {
    this.getAll();
  }

  goPlay(play: string) {
    this.$router.push(`/${play}`);
  }

  async getAll() {
    const allPlays = await Promise.all(this.plays.map((p) => axios.get(`./plays/${p.value}.json`)));
    this.allPlayText = allPlays.map((p) => p.data);
    // console.log("all....", this.allPlayText);
  }

  search() {
    console.log("search", this.searchText);

    const tgt = this.searchText;

    if (!tgt) return;

    const results: any[] = [];

    this.allPlayText.forEach((scenes) => {
      scenes.forEach((scene: any) => {
        scene.lines.forEach((line: any) => {
          if (line.type === "text") {
            if (line.value.includes(tgt)) {
              results.push({
                play: scene.play,
                scene: scene.title,
                speaker: line.speaker,
                text: line.value,
              });
            }
          }
        });
      });
    });

    this.searchResults = results;
  }
}
</script>

<style scoped>
.play {
  cursor: pointer;
}
.play:hover {
  opacity: 0.5;
}
.created {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
}
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  opacity: 50%;
}
</style>
