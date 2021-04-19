<template>
  <div>
    <h2>Explore the Bard</h2>

    <div>
      <div v-for="play in plays" :key="play.value" @click="goPlay(play.value)" class="play">
        {{ play.label }}
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

import { plays } from "@/utils";

@Component
export default class Play extends Vue {
  plays = plays;

  goPlay(play: string) {
    this.$router.push(`/${play}`);
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
