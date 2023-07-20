<template>
    <div id="listContent" :style="{ width:width<=100?width+'%':width+'px', color:button?'#0000FF':'' }">
        <img v-if="emoji" src="@/assets/pushpin.png"/>
        <div class="box" 
        :style="{ width:width<=100?width+'%':width+'px', height:height+'px', backgroundColor:button?'#EDEDED':'' }"
        :class="{ emoji, rounded:height<=40 }"
        onclick="window.open(href,'_blank');"
        >
            <div :style="{ width:width<=100?'98%':width-50+'px', textAlign:textAlign }" >
                <div :style="{ display:expand?'inline-block':'', verticalAlign:expand?'middle':'' }"><slot/></div>
                <svg-icon type="mdi" :path=down style="float: right;" v-if="expand"></svg-icon>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronDown } from '@mdi/js';

export default {
  name: 'listContent',
  components: {
    SvgIcon
  },
  data () {
    return {
        down: mdiChevronDown
    }
  },
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
    },
    button: Boolean,
    href: Text
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