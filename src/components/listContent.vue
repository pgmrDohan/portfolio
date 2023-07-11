<template>
    <div id="listContent">
        <img v-if="emoji==='true'" src="@/assets/pushpin.png"/>
        <div :class="[emoji==='true' ? 'bottom12' : '']">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'listContent',
  props: {
    emoji: Boolean,
  }
}
</script>

<style scoped>
#listContent {
    margin-top: 7px;
    margin-right: 10px;
}

#listContent img {
    width: 15px;
}

#listContent div {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.15);
    width: 250px;
    height: 130px;
    border-radius: 10px;
    position: relative;
    display : flex;
    justify-content: center;
    align-items : center;
}

.bottom12 {
    position: relative;
    bottom: 12px;
}
</style>