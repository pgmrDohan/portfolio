<template>
    <div id="listContent" :style="{ width:width<=100?width+'%':width+'px'}">
        <img v-if="emoji" src="@/assets/pushpin.png"/>
        <div class="box" :style="{ width:width<=100?width+'%':width+'px', height:height+'px' }" :class="{ emoji, rounded:height<=40 }">
            <div :style="{ width:width<=100?'98%':width-50+'px', textAlign:textAlign }" >
                <div :style="{ display:expand?'inline-block':'', verticalAlign:expand?'middle':'' }"><slot/></div>
                <p v-if="expand" style="float: right;" class="material-symbols-outlined">expand_more</p>
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
    },
    expand: {
        type: Boolean,
        default: false
    }
  }
}
</script>

<style scoped>
#listContent {
    margin-top: 7px;
    margin-right: 10px;
    display: inline-table;
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

.rounded {
    border-radius: 100px;
}

.emoji.rounded {
    bottom: 15px;
    margin-bottom: -15px;
}
</style>