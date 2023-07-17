<template>
  <div id="typingTitle">
    <p id="typing" v-html=renderTitle />
  </div>
</template>

<script>
export default {
  name: 'typingTitle',
  props: {
    title: {
      type: String,
      validator: (prop) => prop.match(/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g).every(e =>  e === "<br />"),
    }
  },
  data (){
    return {
      render:setInterval(this.rendering,100),
      typingSteps: this.typingStep(this.title),
      renderTitle: "",
      renderLoop:0,
      rendered:0,
    }
  },
  methods: {
    rendering () {
      if(this.renderLoop+1 >= this.typingSteps.length)
        clearInterval(this.render);
      
      this.renderTitle = this.renderTitle.slice(0, -1);

      if (this.typingSteps[this.renderLoop] !== "�"){
        this.renderTitle += this.typingSteps[this.renderLoop++]
      } else {
        this.renderTitle += this.title[this.rendered++];
        this.renderTitle += " ";
        this.renderLoop++
      }
    },
    typingStep (title){
      let typingSteps  = [];

      const Hangul = require('hangul-js');
      let disasmTitle = Hangul.disassemble(title);

      for (let i = 0; i < disasmTitle.length; i++){
        if (disasmTitle.slice(i,i+6).join('') === "<br />") {
          typingSteps.push("<br/>");
          typingSteps.push("�");
          i++;
        }
        if (Hangul.isVowel(disasmTitle[i]) && Hangul.isJong(disasmTitle[i+1])) {
          typingSteps.push(Hangul.assemble(disasmTitle[i-1]+disasmTitle[i]));
          typingSteps.push(Hangul.assemble(disasmTitle[i-1]+disasmTitle[i]+disasmTitle[i+1]));
          i++
          typingSteps.push("�");
        } else if (Hangul.isVowel(disasmTitle[i]) && Hangul.isVowel(disasmTitle[i+1])) {
          typingSteps.push(Hangul.assemble(disasmTitle[i-1]+disasmTitle[i]));
          typingSteps.push(Hangul.assemble(disasmTitle[i-1]+disasmTitle[i]+disasmTitle[i+1]));
          i++
          if (Hangul.isJong(disasmTitle[i+1])) {
            typingSteps.push(Hangul.assemble(disasmTitle[i-2]+disasmTitle[i-1]+disasmTitle[i]+disasmTitle[i+1]));
            i++
          }
          typingSteps.push("�");
        } else if (Hangul.isVowel(disasmTitle[i])){
          typingSteps.push(Hangul.assemble(disasmTitle[i-1]+disasmTitle[i]));
          typingSteps.push("�");
        } else {
          typingSteps.push(disasmTitle[i]);
          if(!Hangul.isCho(disasmTitle[i])) {typingSteps.push("�")}
        }
      }
      return typingSteps
    }
  }
}
</script>

<style scoped>
p {
  font-family: Pretendard Variable, sans-serif;
  font-size: 43px;
  font-weight:850;
}

p::before {
  background-color: #555555;
  transform-origin: bottom right;
}
</style>