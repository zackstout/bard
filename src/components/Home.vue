<template>
  <div>
    <h2>Explore the Bard</h2>

    <div>
      <div v-for="play in plays" :key="play.value" @click="goPlay(play.value)" class="play">
        {{ play.label }}
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
</style>
