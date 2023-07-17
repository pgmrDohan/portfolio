<template>
    <div id="listContent">
        <img v-if="emoji" src="@/assets/pushpin.png"/>
        <div class="box" :style="{ width:width+'px', height:height+'px' }" :class="{ emoji }">
            <div :style="{ width:width-50+'px', textAlign:textAlign }">
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'listContent',
  props: {
    emoji: Boolean,
    width: {
        type: Number,
        default: 250
    },
    height: {
        type: Number,
        default: 130
    },
    textAlign: {
        type:String,
        default: "left"
    }
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

.box {
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    position: relative;
    display : flex;
    justify-content: center;
    align-items : center;
}

.emoji {
    position: relative;
    bottom: 12px;
    margin-bottom: -12px;
}
</style>