<template>
  <div id="titleContent">
    <h1 :style="cssVars">{{ title }}</h1>
    <p :style="cssVars" v-html="msg"></p>
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'titleContent',
  props: {
    msg: String,
    title: String,
    align: String,
  },
  computed: {
    cssVars () {
      return{
        '--align':this.align
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#titleContent {
  margin: 150px 194px 150px 194px;
}

h1 {
  font-family: Pretendard Variable, sans-serif;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 7px;
  text-align: var(--align);
}

p {
  font-family: Pretendard Variable, sans-serif;
  font-size: 17px;
  font-weight: 400;
  margin-top: 7px;
  text-align: var(--align);
}
</style>
