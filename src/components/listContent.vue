<template>
    <div id="listContent" :style="{ width:width<=100?width+'%':width+'px', color:button?'#0000FF':'' }">
        <img v-if="emoji" src="@/assets/pushpin.png"/>
        <div class="box" 
        :style="{ width:width<=100?width+'%':width+'px', height:expanded?'100%':height+'px' }"
        :class="{ emoji, rounded:expanded?false:height<=40, button }"
        @click="button?onClick(href):expanded?expanded=false:expand?expanded=true:''"
        >
            <div :style="{ width:width<=100?width+'%':width+'px', height:height+'px', justifyContent:expand?'space-between':'center', alignItems:expanded?'start':'center' }" style="display: flex;">
                <div :style="{ textAlign:textAlign, marginLeft:expand?'20px':'', marginTop:expanded?'10px':'' }" >
                    <slot/>
                </div>
                <svg-icon type="mdi" :path=expanded?up:down style="margin-right: 20px;" :style="{ marginTop:expanded?'10px':'' }" v-if="expand"/>
            </div>
            <div v-if="expanded" class="hr-line-bottom"/>
            <p style="margin-top: 5px; margin-left: 20px; padding-right: 20px; padding-bottom: 10px;" v-if="expanded"><slot name="content"/></p>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';

export default {
  name: 'listContent',
  components: {
    SvgIcon
  },
  data () {
    return {
        expanded: false,
        down:mdiChevronDown,
        up:mdiChevronUp
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
    href: Text,
    content: Text
  },
  methods: {
    onClick (uri) {
        window.open(uri,'_blank');
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

.button {
    background-color: #ededed;
    cursor: pointer;
}

.button:hover {
    background-color: #dddddd;
}

.hr-line-bottom {
    border-top: 1px solid #dddddd;
    margin: 3px 0px;
    width: 90%;
}

p {
    font-family: Pretendard Variable, sans-serif;
    font-size: var(--font-size-sm);
    font-weight:400;
}
</style>