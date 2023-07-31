<template>
  <div id="titleContent" :style="{ textAlign:align }">
    <h1>{{ title }}</h1>
    <p v-html="msg"></p>
    <div style="width: 100%;">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'titleContent',
  props: {
    msg: String,
    title: String,
    align: String,
  }
}
</script>

<style scoped>
#titleContent {
  position: relative;
  margin: 150px 5% 0px 5%;
}

h1 {
  font-family: Pretendard Variable, sans-serif;
  font-size: var(--font-size-lg);
  font-weight: 800;
  margin-bottom: 7px;
}

p {
  font-family: Pretendard Variable, sans-serif;
  font-size: var(--font-size-md);
  font-weight: 400;
  margin-top: 7px;
}
</style>