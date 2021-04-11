<template>
  <div>
    <!-- <div>Welcome home!</div>

    <div @click="$router.push('/Play1')">Play1</div>
    <div @click="$router.push('/Play2')">Play2</div> -->

    <h2>Explore the Bard</h2>

    <div>
      <div v-for="play in plays" :key="play.value" @click="goPlay(play.value)">
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
  //   @Prop() private msg!: string;

  goPlay(play: string) {
    this.$router.push(`/${play}`);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
