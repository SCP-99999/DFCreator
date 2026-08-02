<script setup>
import { ref, onMounted } from "vue";
import DraggableResizableVue from "vue-draggable-resizable";
import MainWindow from "./components/HtmlBase/mainwindow.vue";
import Description from "./components/HtmlBase/description.vue";
import Event from "./components/HtmlBase/event.vue";
import Superevent from "./components/HtmlBase/superevent.vue";
import Generic from "./components/Controller/Generic.vue";
import PicManager from "@/components/Controller/PicManager.vue"; // ✅ 引入新版必备的 PicManager
import { initApp } from "./utils/onload.js";
import { mousePosition } from "./composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from "howler";
import { usePresetDB } from "@/composables/usePresetDB";
const { clearAutoSave } = usePresetDB();

// ============================================================
//  ✅ 移植进来的新版点击功能
// ============================================================
const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);

window.openLeaderEditor = () => {
  picManagerType.value = "leader";
  picManagerTargetId.value = "leaderpic";
  picManagerResizable.value = false;
  picManagerVisible.value = true;
};

const updatePicture = ({ id, url, scale }) => {
  const element = document.getElementById(id);
  if (element) {
    element.src = url ? url : element.src;
    if (scale !== undefined) {
      element.style.scale = scale;
    }
  }
};

// ============================================================
//  🟢 旧版自带的基础设置
// ============================================================
const settingsVisible = ref(false);
const draggable = ref(false);

let maxZIndex = ref(1);

function bringToFront(windowName) {
  maxZIndex.value++;
  state.windows[windowName].zIndex = maxZIndex.value;
}

function openSettings() {
  settingsVisible.value = true;
}

const handleClose = () => {
  new Howl({
    src: ["/sfx/click_window_close.wav"],
    volume: 1,
  }).play();
};

const handleShow = () => {
  new Howl({
    src: ["/sfx/click_window_open.wav"],
    volume: 1,
  }).play();
};

onMounted(() => {
  document.addEventListener("mousedown", (e) => {
    mousePosition.down.x = e.clientX;
    mousePosition.down.y = e.clientY;
  });
  document.addEventListener("mouseup", (e) => {
    mousePosition.up.x = e.clientX;
    mousePosition.up.y = e.clientY;
  });
  try {
    initApp();
  } catch (error) {
    localStorage.clear();
    clearAutoSave();
    location.reload();
  }
});
</script>

<template>
  <div id="app-container" @click.self="openSettings" @touchstart.self="openSettings"
    style="width: 100vw; height: 100vh;">
    
    <!-- 主窗口（旧版框架） -->
    <DraggableResizableVue 
      v-show="state.windows.main.visible" 
      v-model:active="state.windows.main.active"
      :z="state.windows.main.zIndex" 
      @activated="bringToFront('main')" 
      class="window" 
      :draggable="false"
    >
      <MainWindow />
    </DraggableResizableVue>

    <!-- ✅ 领袖透明点击层（把它加在外面，绝对不被拖拽库拦截） -->
    <div 
      v-show="state.windows.main.visible"
      style="
        position: absolute;
        top: 93px;
        left: 18px;
        width: 170px;
        height: 230px;
        z-index: 99999;
      "
      onclick="window.openLeaderEditor()"
    ></div>

    <!-- 描述窗口 -->
    <DraggableResizableVue 
      v-show="state.windows.description.visible" 
      :x="605" 
      :y="9"
      v-model:w="state.windows.description.w"
      v-model:h="state.windows.description.h" 
      v-model:active="state.windows.description.active"
      :z="state.windows.description.zIndex" 
      @activated="bringToFront('description')" 
      class="window"
      :draggable="draggable" 
      :drag-cancel="'.non-draggable'"
    >
      <Description />
    </DraggableResizableVue>

    <!-- 事件窗口 -->
    <DraggableResizableVue 
      v-show="state.windows.event.visible" 
      :x="300" 
      :y="0"
      v-model:w="state.windows.event.w"
      v-model:h="state.windows.event.h" 
      v-model:active="state.windows.event.active"
      :z="state.windows.event.zIndex" 
      @activated="bringToFront('event')" 
      class="window"
      :draggable="draggable" 
      :drag-cancel="'.non-draggable'"
    >
      <Event />
    </DraggableResizableVue>

    <!-- 超事件窗口 -->
    <DraggableResizableVue 
      v-show="state.windows.superevent.visible" 
      :x="1030" 
      :y="69"
      v-model:w="state.windows.superevent.w"
      v-model:h="state.windows.superevent.h" 
      v-model:active="state.windows.superevent.active"
      :z="state.windows.superevent.zIndex" 
      @activated="bringToFront('superevent')" 
      class="window" 
      :draggable="draggable"
      :drag-cancel="'.non-draggable'"
    >
      <Superevent />
    </DraggableResizableVue>

    <Dialog v-model:visible="settingsVisible" :style="{ minHeight: '60%', fontFamily: 'Aldrich, FZRui' }" header="控制面板"
      id="control-panel" @hide="handleClose" @show="handleShow">
      <Generic :windows="state.windows" v-model:draggable="draggable" />
    </Dialog>

    <!-- ✅ 最后面加上新版 PicManager 弹窗 -->
    <PicManager 
      v-model:visible="picManagerVisible" 
      :type="picManagerType" 
      :targetId="picManagerTargetId"
      :resizable="picManagerResizable" 
      @update:pic="updatePicture" 
    />
  </div>
</template>

<style>
.window {
  position: absolute;
}
</style>