<template>
  <div id="app">
    <LoadingScreen />
    <TitleScreen />
    <ThreeScene />
  </div>
</template>

<script>
import ThreeScene from "./components/ThreeScene.vue";
import TitleScreen from "./components/TitleScreen.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
  name: "App",
  components: {
    LoadingScreen,
    TitleScreen,
    ThreeScene,
  }
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  font-family: 'Space Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
}
</style>
