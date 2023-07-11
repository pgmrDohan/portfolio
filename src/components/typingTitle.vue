<template>
  <div id="typingTitle">
    <p id="typing" v-html="titleT"></p>
  </div>
</template>

<script>
export default {
  name: 'typingTitle',
  props: {
    title: String,
  },
  data (){
    return {
      typing:0,
      titleT: "",
      n:0,
      j:0,
      titleD: this.koreanD(this.title)
    }
  },
  methods: {
    typingM () {
      if(this.n+1>=this.titleD.length) {
        clearInterval(this.typing);
      }
      if (this.titleD[this.n]!="/"){
        this.titleT = this.titleT.slice(0, -1);
        this.titleT += this.titleD[this.n++]
      } else {
        this.titleT = this.titleT.slice(0, -1);
        this.titleT += this.title[this.j++];
        this.titleT += " ";
        this.n++
      }
    },
    koreanD (title){
      const Hangul = require('hangul-js');
      let titleD = Hangul.disassemble(title);
      let disassembled = [];
      for (let i = 0; i < titleD.length; i++){
        //disassembled.push(i);
        if (Hangul.isVowel(titleD[i]) && Hangul.isJong(titleD[i+1])) {
          disassembled.push(Hangul.assemble(titleD[i-1]+titleD[i]));
          disassembled.push(Hangul.assemble(titleD[i-1]+titleD[i]+titleD[i+1]));
          i++
          disassembled.push("/");
        } else if (Hangul.isVowel(titleD[i]) && Hangul.isVowel(titleD[i+1])) {
          disassembled.push(Hangul.assemble(titleD[i-1]+titleD[i]));
          disassembled.push(Hangul.assemble(titleD[i-1]+titleD[i]+titleD[i+1]));
          i++
          if (Hangul.isJong(titleD[i+1])) {
            disassembled.push(Hangul.assemble(titleD[i-2]+titleD[i-1]+titleD[i]+titleD[i+1]));
            i++
          }
          disassembled.push("/");
        } else if (Hangul.isVowel(titleD[i])){
          disassembled.push(Hangul.assemble(titleD[i-1]+titleD[i]));
          disassembled.push("/");
        } else {
          disassembled.push(titleD[i]);
          if(!Hangul.isCho(titleD[i])) {disassembled.push("/")}
        }
      }
      return disassembled
    }
  },
  mounted () {
    this.typing=setInterval(this.typingM,200);
  }
}
</script>

<style scoped>
p {
  font-family: Pretendard Variable, sans-serif;
  font-size: 43px;
  font-weight:850;
  display: table-cell;
  border-right: 0.05em solid #000000; 
  animation: 
    cursor 0.5s ease infinite;
}

@keyframes cursor {
    to {
        border-color: transparent;
    }
}
</style>