<template>
  <div class="max"><a href="/" id="inner"><typingTitle
    title="소프트웨어 개발자 권도한입니다."
  /></a></div>

  <titleContent 
    title="print(“Hello, World!”)"
    msg="안녕하세요. 학생 개발자 권도한입니다.<br />다양한 언어를 다루면서 느리지만 확실하고 넓게 전진하고 있습니다.<br />프로그래밍 뿐만 아니라 보안이나 디자인에도 관심을 가지고 있어요."
    align="left"
  >
    <listContent emoji>
      <p class="leftA"><strong>Age</strong>16</p>
      <p class="leftA"><strong>Email</strong><a class="aAnimation" href="mailto:me@dohan.bio?subject=[Inquiry] ">me@dohan.bio</a></p>
      <p class="leftA"><strong>Github</strong><a class="aAnimation" href="https://github.com/pgmrDohan" target='_blank'>@pgmrDohan</a></p>
      <p class="leftA"><strong>Discord</strong><a class="aAnimation" href="https://discordapp.com/users/795869602566635540" target='_blank'>@i70h4n</a></p>
    </listContent>
    <listContent emoji textAlign="center">
      <p><strong>Working at</strong></p><br>
      <p>Software Development<br>UX/UI Design<br>Computer Security</p>
    </listContent>
  </titleContent>

  <titleContent
    title="편리와 도움. 능력향상과 최초."
    msg="다른 누군가에게 편리와 도움을 주는 것들을 만듭니다.<br />그러면서도 저 자신의 능력 향상과 최초라는 업적을 얻기 위해 노력합니다.<br />1석 4조인 셈이죠."
    align="right"
  >
  </titleContent>
  
  <titleContent
    title="느리지만 꾸준히 성실하게 그리고 확실히"
    msg="CTF, 해커톤, 공모전 등 대회에 참여하고 실적을 쌓아갑니다.<br />여러 자격증도 하나 씩 얻고자 합니다.<br />착실히 앞으로 나아갑니다."
    align="left"
  >
    <listContent emoji expand :height=40 :width=100>
      <p><strong style="margin-right: 20px;">뭐지 뉴스래터 아티클 기고</strong>2023</p>
      <template v-slot:content>
        <a class="aAnimation" href="https://moji.or.kr/" target='_blank'>https://moji.or.kr/</a> 에서 매주 IT에 관한 내용을 정리하여 쉽게 이해할 수 있도록 뉴스래터를 작성, 기고하고 있습니다.<br>
        보안 관련 소식 및 신제품 출시나 관련 루머 등의 내용을 전반적으로 다루고 있으며 관련 정보 습득을 위해 다양한 뉴스래터를 구독하고 있습니다.
      </template>
    </listContent>
    <listContent expand :height=40 :width=100>
      <p><strong style="margin-right: 20px;">한국산업인력공단 정보처리기능사 자격증 취득</strong>2022</p>
      <template v-slot:content>
        <a class="aAnimation" href="http://www.q-net.or.kr/crf005.do?id=crf00503&jmCd=6921" target="_blank">한국산업인력공단</a>에서 시행하는 정보처리기능사 자격증을 취득하였습니다.<br>
      </template>
    </listContent>
    <listContent expand :height=40 :width=100>
      <p><strong style="margin-right: 20px;">한국과학창의재단 대학부설 과학영재 교육원 사사과정 연구 성과 발표대회 수상</strong>2022</p>
    </listContent>
    <listContent expand :height=40 :width=100>
      <p><strong style="margin-right: 20px;">J2KB 전국연합코딩동아리 수료 및 인터뷰</strong>2021</p>
    </listContent>
    <listContent :height=40 :width=100 textAlign="center" button href="https://dohanspace.notion.site/Kwon-DoHan-34f1bf3d841c4a70ba7c8bcbf941c443">
      <div style="display: inline-flex; align-items: center;">
        <svg-icon type="mdi" :path=link width="18px" style="margin-right: 5px;"></svg-icon>
        <span>dohanspace.notion.site</span>
      </div>
    </listContent>
  </titleContent>
  
  <titleContent 
    title="상상을 현실로 바꾸는 기술스택들" 
    msg="필요한 여러 기술들을 배워갑니다.<br />많은 우물이지만 깊게 파내어 마스터하기 위해 노력합니다.<br />넘치는 생각들을 현실로 옮길 수 있도록 또 다른 우물을 파고 있습니다."
    align="right"
  >
  </titleContent>

  <div id="footer">
    <a class="aAnimation" href="/files/DohanKwon_Resume.pdf" target='_blank'><p>PDF Version</p></a>
    <p>Copyright 2023. Dohan all rights reserved.</p>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLinkVariant } from '@mdi/js';

import titleContent from './components/titleContent.vue'
import typingTitle from './components/typingTitle.vue'
import listContent from './components/listContent.vue';

export default {
  name: 'App',
  components: {
    titleContent,
    typingTitle,
    listContent,
    SvgIcon
  },
  data () {
    return {
      link: mdiLinkVariant
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.max {
  height: 100vh;
  width: 100%;
  display: table;
}

#inner {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

a {text-decoration: none; color: inherit;}

.aAnimation {
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: #000040;
}
.aAnimation::after{
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: #555555;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.aAnimation:hover::after{
  transform: scaleX(1);
  transform-origin: bottom left;
}

div {
  font-family: Pretendard Variable, sans-serif;
  font-size: var(--font-size-md);
  font-weight:400;
}

.leftA {text-align:right;}

.leftA strong {
  font-weight:600;
  text-align: left;
  float: left;
  margin-right: 20px;
}

#footer {
  text-align: center;
  margin-top: 150px;
  margin-bottom: 30px;
  font-family: Pretendard Variable, sans-serif;
  font-size: var(--font-size-exsm);
  font-weight:300;
}
</style>
