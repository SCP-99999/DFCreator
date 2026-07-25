<script setup>
import { ref, onMounted } from "vue";
import DraggableResizableVue from "vue-draggable-resizable";
import MainWindow from "./components/HtmlBase/mainwindow.vue";
import Description from "./components/HtmlBase/description.vue";
import Event from "./components/HtmlBase/event.vue";
import Superevent from "./components/HtmlBase/superevent.vue";
import Generic from "./components/Controller/Generic.vue";
import { initApp } from "./utils/onload.js";
import { mousePosition } from "./composables/useMousePosition.js";
import { state } from "@/utils/state.js";
import { Howl } from "howler";
import { usePresetDB } from "@/composables/usePresetDB";
const { clearAutoSave } = usePresetDB();

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
</script>

<template>
  <div id="app-container" @click.self="openSettings" @touchstart.self="openSettings"
    style="width: 100vw; height: 100vh;">
    
    <!-- 主窗口 -->
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

    <!-- 事件窗口（✅ 默认隐藏，只有 visible 为 true 时才显示） -->
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
  </div>
</template>

<style>
.window {
  position: absolute;
}
</style>