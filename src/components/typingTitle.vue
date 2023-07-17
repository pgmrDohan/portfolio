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
      render:setInterval(this.rendering,120),
      typingProcess: this.processing(this.title),
      renderTitle: "",
      idxRun:0,
      idxType:0,
      lastType: '',
    }
  },
  methods: {
    rendering () {
      const Hangul = require('hangul-js');

      let run = this.typingProcess[this.idxRun];

      if (this.idxType >= run.length) {
          this.idxRun += 1;
          this.idxType = 0;
          this.lastType = this.renderTitle;

          if (this.idxRun >= this.typingProcess.length) {
            clearInterval(this.render);
          }

          return;
      }

      let typing = Hangul.assemble(run.slice(0, this.idxType + 1));

      this.renderTitle = this.lastType + typing;
      this.idxType += 1;
    },

    processing (title){
      const Hangul = require('hangul-js');
      let disassembled = Hangul.disassemble(title, true);

      let textProcess = [];
      let run = [];
      for (let i in disassembled) {
          let charProcess = disassembled[i];
          if (charProcess.length > 1) {
              run = run.concat(charProcess);
          } else {
              if (run.length > 0) {
                  textProcess.push(run);
                  run = [];
              }
              textProcess.push(charProcess);
          }
      }
      if (run.length > 0) {
          textProcess.push(run);
      }

      return textProcess;
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

p::after {
  content: "_";
  animation: 
    cursor 0.5s ease infinite;
}

@keyframes cursor {
    to {
        color: transparent;
    }
}
</style>