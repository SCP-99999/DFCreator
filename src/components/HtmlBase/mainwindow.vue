<script setup>
import { ref, onMounted, nextTick } from "vue";
import Pie from "./piechart.vue";
import ChartEditor from "../Controller/ChartEditor.vue";
import PicManager from "@/components/Controller/PicManager.vue";
import { mousePosition } from "../../composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from 'howler';

import Spirit from "./spirit.vue";
import Economy from "./economy.vue";
import News from "./news.vue";

const editorVisible = ref(false);
const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
const ideologySrc = ref("/preset/national_socialism_group.png");

const showTip = ref(false);

const openLeaderEditor = () => {
  picManagerType.value = "leader";
  picManagerTargetId.value = "leaderpic";
  picManagerResizable.value = false;
  picManagerVisible.value = true;
};

const handlePicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );
  if (distance > 5) return;

  let target = event.target;
  while (target && target !== document) {
    if (target.dataset && target.dataset.modifiable === "true") {
      break;
    }
    target = target.parentElement;
  }
  
  if (!target || target === document) return;

  picManagerType.value = target.dataset.type;
  picManagerTargetId.value = target.dataset.targetId;
  picManagerResizable.value = target.dataset.resizable === "true";
  picManagerVisible.value = true;
};

onMounted(() => {
  nextTick(() => {
    showTip.value = true;
    setTimeout(() => {
      showTip.value = false;
    }, 4000);
  });
  
  // 监听原生自定义事件，触发弹窗（这是接收点击的核心！）
  window.addEventListener('openLeaderEditor', () => {
    openLeaderEditor();
  });

  document.addEventListener("click", handlePicClick);

});

const updatePicture = ({ id, url, scale }) => {
  if (id === "ideologypic") {
    if (url) ideologySrc.value = url;
    const elements = document.querySelectorAll("#ideologypic");
    elements.forEach(el => {
      if (url) el.src = url;
      if (scale !== undefined) el.style.scale = scale;
    });
    return;
  }
  const element = document.getElementById(id);
  if (element) {
    element.src = url ? url : element.src;
    if (scale !== undefined) {
      element.style.scale = scale;
    }
  }
};

const handleClose = () => {
  new Howl({ src: ["/sfx/click_window_close.wav"], volume: 1 }).play();
};
const handleShow = () => {
  new Howl({ src: ["/sfx/click_window_open.wav"], volume: 1 }).play();
};
</script>

<template>
    
    <!-- ================= 左侧面板：旗帜与领袖 ================= -->
    <div>
      <div style="
          position: absolute;
          top: 10px;
          left: 33px;
          height: 60px;
          width: 100px;
          z-index: 0;
        ">
        <img id="flag-overlay" src="/template/flag_overlay.png" data-modifiable="true" data-type="flag"
          data-resizable="false" data-target-id="flagpic" :style="{
            position: 'absolute',
            top: '0',
            left: '0',
            height: 'inherit',
            width: 'inherit',
            scale: 1.3,
            zIndex: 2,
          }" />
        <img id="flagpic" class="pic" src="/preset/GER.png" style="
            position: absolute;
            top: 0;
            left: 0;
            height: inherit;
            width: inherit;
          " />
      </div>
      <div style="
          position: absolute;
          top: 10px;
          left: 22px;
          height: 55px;
          width: 85px;
          z-index: 3;
        ">
        <img id="flag-overlay" src="/template/flag_overlay.png" data-modifiable="true" data-type="flag"
          data-resizable="false" data-target-id="flagpic" :style="{
            position: 'absolute',
            top: '0',
            left: '0',
            height: 'inherit',
            width: 'inherit',
            scale: 1.3,
            zIndex: 2,
            opacity: 0,
          }" />
      </div>
      
      <!-- 领袖头像区域（最终完美版） -->
      <div style="
          position: absolute;
          top: 93px;
          left: 18px;
          height: 230px;
          width: 170px;
          z-index: 10;
        ">
        
        <!-- 实际显示的头像图片 -->
        <img id="leaderpic" class="pic" src="/preset/Portrait_GER_Reichstag_Emergency_Council.png" style="
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          " />

        <!-- ⭐ 终极透明点击层 -->
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 20;
            background-color: rgba(0, 0, 0, 0); /* 完全透明 */
          "
          onmousedown="
            window.dispatchEvent(new CustomEvent('openLeaderEditor'));
          "
        ></div>
      </div>
      
      <div style="
          position: absolute;
          top: 79px;
          left: 7px;
          height: 160px;
          width: 120px;
          z-index: 0;
        ">
        <img src="/template/Leader_Background.png" style="
            position: absolute;
            top: 0;
            left: 0;
            height: inherit;
            width: inherit;
          " />
      </div>
    </div>

    <!-- ================= 右侧面板与信息 ================= -->
    <div>
      <img src="/template/mainwindow.png" style="position: absolute; z-index: 2; left: 0px; top: 0px; width: 600px;" />
      
      <div style="
          position: absolute;
          top: 22px;
          left: 183px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
        ">
        <img id="ideologypic" 
             class="pic" 
             :src="ideologySrc" 
             data-modifiable="true"
             data-type="ideology" 
             data-resizable="true" 
             data-initial-scale="1" 
             data-target-id="ideologypic" 
             style="position: absolute; scale: 1;" />
      </div>

      <div style="
          position: absolute;
          top: 305px;
          left: 370px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          pointer-events: none; 
        ">
        <img class="pic" 
             :src="ideologySrc" 
             style="position: absolute; scale: 0.6;" />
      </div>
      
      <div style="
          position: absolute;
          top: 43px;
          left: 565px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
        <img id="factionpic" class="pic" src="/preset/Leader-Einheitspakt.png" data-modifiable="true"
          data-type="faction" data-resizable="true" data-initial-scale="0.8"
          :style="{ position: 'absolute', scale: 0.8 }" data-target-id="factionpic" />
      </div>
      
      <div style="
          position: absolute;
          top: 150px;
          left: 250px;
          z-index: 5;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
        <img id="focuspic" class="pic" src="/preset/goal_unknown.png" data-modifiable="true" data-type="focus"
          data-resizable="true" data-initial-scale="1.9" :style="{ position: 'absolute', scale: 1.1 }"
          data-target-id="focuspic" />
      </div>

      <div style="
          position: absolute;
          top: 399px;
          left: 435px;
          width: 100px;
          height: 100px;
          z-index: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        ">
        <img src="/template/bck_shadow.png" style="position: absolute; scale: 0.6; z-index: 0;" />
        <Pie class="piechart" style="
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: none;
            scale: 1.6;
            z-index: 0;
            pointer-events: none;
          " v-model="state.chartData" />
      </div>
      
      <div style="
          position: absolute;
          top: 370px;
          left: 410px;
          width: 150px;
          height: 150px;
          z-index: 7;
          display: flex;
          justify-content: center;
          align-items: center;
        " @click="editorVisible = true">
        <img src="/template/pol_piechart_overlay_63x63.png" style="scale: 0.42; pointer-events: none;" />
      </div>

      <!-- ================= 嵌入的子组件 ================= -->
      <div style="position: absolute; top: 220px; left: 200px; width: 400px; height: 80px; z-index: 20;">
        <Spirit />
      </div>
      
      <div 
        style="position: absolute; top: 300px; left: 225px; z-index: 20;"
        @click="
          picManagerType = 'econ';
          picManagerTargetId = 'econpic';
          picManagerResizable = true;
          picManagerVisible = true;
        "
      >
        <Economy />
      </div>

      <div style="position: absolute; top: 350px; left: -5px; z-index: 2; transform: scale(0.712); transform-origin: top left; pointer-events: auto;">
        <News />
      </div>

      <!-- ================= 大选区块（向内收缩版） ================= -->
      <div style="
          position: absolute;
          top: 608px;
          left: 350px;
          width: 260px;          /* ⭐ 锁定一个固定宽度框 */
          display: flex;
          justify-content: center; /* ⭐ 让文字在框内绝对居中 */
          align-items: center;
          z-index: 3;
        ">
        <p id="election" class="text" style="
            text-align: center;    /* ⭐ 文字居中对齐 */
            width: auto;           /* 宽度跟随文字，居中定位 */
            font-family: Aldrich, FZRui;
            font-size: 16px;
            color: rgb(166,181,179);
            text-shadow: 
              0.5px 0.5px 0px #000000,
              -0.5px -0.5px 0px #000000,
              0.5px -0.5px 0px #000000,
              -0.5px 0.5px 0px #000000,
              0px 0px 0px #000000;
            margin: 0;
            padding: 0.4px;
            white-space: nowrap;
          ">无选举</p>
      </div>

      <!-- ================= 国家精神文字区域 ================= -->
      <div style="
        position: absolute;
        top: 88px;
        left: 530px;
        width: 300px;
        height: 120px;
        z-index: 22;
        pointer-events: none;
      ">
        <div style="
          position: absolute;
          top: 140px;
          right: 200px;
          width: 150px;
          display: flex;
          flex-direction: column;
          pointer-events: auto;
        ">
          <div contenteditable="true"
               @blur="(e) => { state.spiritTexts[0] = e.target.innerText }"
               @keydown.enter.prevent
               style="
                 outline: none;
                 font-family: Aldrich, FZRui;
                 font-size: 14px;
                 color: #e6e6e6;
                 text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
                 padding: 2px 4px;
                 border-radius: 2px;
               ">
            1. 军阀割据
          </div>
          <div contenteditable="true"
               @blur="(e) => { state.spiritTexts[1] = e.target.innerText }"
               @keydown.enter.prevent
               style="
                 outline: none;
                 font-family: Aldrich, FZRui;
                 font-size: 14px;
                 color: #e6e6e6;
                 text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
                 padding: 2px 4px;
                 border-radius: 2px;
               ">
            2. 柏林之战
          </div>
          <div contenteditable="true"
               @blur="(e) => { state.spiritTexts[2] = e.target.innerText }"
               @keydown.enter.prevent
               style="
                 outline: none;
                 font-family: Aldrich, FZRui;
                 font-size: 14px;
                 color: #e6e6e6;
                 text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
                 padding: 2px 4px;
                 border-radius: 2px;
               ">
            3. 分崩离析的国家
          </div>
        </div>
      </div>

      <!-- ================= 领袖名字（完美居中向内收缩版） ================= -->
      <div style="
          position: absolute;
          top: 333px;
          left: 13px;
          width: 180px;          /* ⭐ 给一个固定宽度的框 */
          display: flex;
          justify-content: center; /* ⭐ 强制居中 */
          align-items: center;
          z-index: 3;
        ">
        <p id="leader" class="text" style="
            text-align: center;    /* ⭐ 文字居中对齐 */
            width: auto;
            color: #ffffff;
            font-family: Bombard, FZWH;
            font-size: 16px;
            margin: 0;
            padding: 0 4px;
            white-space: nowrap;
          ">国会紧急委员会</p>
      </div>

      <!-- ================= 顶部静态文字 ================= -->
      <div style="
          z-index: 3;
          position: absolute;
          left: 250px;
          top: 12px;
          color: #ffffff;
          text-shadow: 1px 1px 2px black;
          font-family: Bombard, FZWH;
          font-size: 16px;
          vertical-align: middle;
        ">
        <p id="country" class="text" style="position: absolute; top: -11px; width: max-content">大日耳曼国</p>
        <p id="factiontext" class="text" style="position: absolute; top: 8px; width: max-content">团结协定</p>
        <p id="leader" class="text" style="position: absolute; top: 27px; width: max-content">国会紧急委员会</p>
      </div>

      <!-- ================= 底部政党/意识形态/国策 ================= -->
      <div style="
          position: absolute;
          top: 92px;
          left: 238px;
          font-family: Aldrich, FZRui;
          color: #cccccc;
          text-shadow: 1px 1px 2px black;
          font-size: 17px;
          z-index: 3;
          vertical-align: middle;
        ">
        <p id="party" class="text" style="position: absolute; top: 200px; left: 180px; width: max-content">纳粹党</p>
        <p id="ideologytext" class="text" style="position: absolute; top: 218px; left: 180px; width: max-content">国家社会主义</p>
        <div style="
            position: absolute;
            inline-size: 260px;
            display: flex;
            left: 80px;
            top: 58px;
            justify-content: center;
            align-items: center;
          ">
          <p id="focustext" class="text" style="
              position: absolute;
              text-align: center;
              width: max-content;
              font-size: 18px;
            ">未知国策</p>
        </div>
      </div>
    </div>
  
  <Dialog v-model:visible="editorVisible" header="饼图编辑"
    :style="{ width: '600px', fontFamily: 'Aldrich, FZRui', opacity: 0.9 }" @hide="handleClose" @show="handleShow">
    <ChartEditor v-model="state.chartData" />
  </Dialog>
  
  <PicManager 
    v-model:visible="picManagerVisible" 
    :type="picManagerType" 
    :targetId="picManagerTargetId"
    :resizable="picManagerResizable" 
    @update:pic="updatePicture" 
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>