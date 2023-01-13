<template>
    <div class="threeScene">
        <div class="container" ref="container"></div>
    </div>
</template>

<script>
import ThreeScene from "@/classes/ThreeScene";

export default {
    name: "ThreeScene",
    props: {
        msg: String,
    },
    mounted() {
        ThreeScene.init(this.$refs.container);
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus"></style>
