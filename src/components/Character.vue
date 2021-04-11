<template>
  <div>
    <div>Welcome character! {{ character }} from {{ play }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Character extends Vue {
  @Prop() private character!: string;

  get play() {
    return this.$route.params.play;
  }
}
</script>
