<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { state } from "@/utils/state";
import SpiritManager from "@/components/Controller/SpiritManager.vue";

const spiritManagerVisible = ref(false);
const localPictures = ref([]);

// 是否固定
const isLocked = computed(() => state.spiritTextsLocked);

// 拖动状态
const isDragging = ref(false);
const isResizing = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0, posX: 0 });

// 原始宽高比（用于等比缩放）
const originalRatio = ref(150 / 72);

// ✅ 拖动：只在边框上触发（鼠标靠近边缘 6px 内）
const startDrag = (e) => {
  if (isLocked.value) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const edge = 6;
  const nearLeft = e.clientX - rect.left <= edge;
  const nearRight = rect.right - e.clientX <= edge;
  const nearTop = e.clientY - rect.top <= edge;
  const nearBottom = rect.bottom - e.clientY <= edge;

  if (!nearLeft && !nearRight && !nearTop && !nearBottom) return;

  e.preventDefault();
  isDragging.value = true;
  dragStart.value = {
    x: e.clientX - state.spiritTextsPos.x,
    y: e.clientY - state.spiritTextsPos.y,
  };
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  state.spiritTextsPos.x = e.clientX - dragStart.value.x;
  state.spiritTextsPos.y = e.clientY - dragStart.value.y;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// ✅ 缩放：左下角手柄，保持原比例
const startResize = (e) => {
  if (isLocked.value) return;
  e.preventDefault();
  e.stopPropagation();
  isResizing.value = true;
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: state.spiritTextsPos.w,
    h: state.spiritTextsPos.h,
    posX: state.spiritTextsPos.x,
  };
  // 记录当前比例
  originalRatio.value = state.spiritTextsPos.w / state.spiritTextsPos.h;
  document.addEventListener("mousemove", onResize);
  document.addEventListener("mouseup", stopResize);
};

const onResize = (e) => {
  if (!isResizing.value) return;
  const dx = e.clientX - resizeStart.value.x;
  const dy = e.clientY - resizeStart.value.y;

  // 左下角：往左拉 = 变宽
  let newW = Math.max(50, resizeStart.value.w - dx);
  // 保持原比例计算高度
  let newH = newW / originalRatio.value;

  // 如果按宽度算出来的高度太小，则改用高度反推宽度
  if (newH < 30) {
    newH = 30;
    newW = newH * originalRatio.value;
  }

  // 左边移动时，x 坐标也要跟着调整（保持右边不动）
  state.spiritTextsPos.x = resizeStart.value.posX + (resizeStart.value.w - newW);
  state.spiritTextsPos.w = newW;
  state.spiritTextsPos.h = newH;
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", onResize);
  document.removeEventListener("mouseup", stopResize);
};

// 文字缩放时保持比例
const spiritFontSize = () => {
  const w = state.spiritTextsPos?.w ?? 150;
  return (14 * w / 150) + 'px';
};

onMounted(() => {
  localPictures.value = state.spiritPictures.slice(0, 3);
});

const openSpiritManager = () => {
  localPictures.value = state.spiritPictures.slice(0, 3);
  spiritManagerVisible.value = true;
};

watch(
  () => localPictures.value,
  (newVal) => {
    if (newVal.length > 3) {
      alert("最多只能添加三个国家精神！");
      localPictures.value = newVal.slice(0, 3);
      state.spiritPictures = localPictures.value;
    }
  },
  { deep: true }
);

const onVisibleChange = (visible) => {
  if (!visible) {
    if (state.spiritPictures.length > 3) {
      state.spiritPictures = state.spiritPictures.slice(0, 3);
    }
  }
  spiritManagerVisible.value = visible;
};
</script>

<template>
  <!-- 图标区域 -->
  <div 
    class="spirit-icons-container" 
    @click="openSpiritManager"
    style="
      position: absolute;
      top: 0px;
      left: 0px;
      width: 400px;
      height: 80px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      gap: 0px;
      z-index: 20;
      padding: 10px;
      box-sizing: border-box;
      pointer-events: auto;
    "
  >
    <img 
      v-for="(spirit, index) in localPictures" 
      :key="spirit.id || index" 
      :src="spirit.url" 
      :title="spirit.filename"
      :style="{
        height: '80px',       
        width: 'auto',
        maxWidth: '90px',
        objectFit: 'contain',
        position: 'relative',
        zIndex: 21,
      }" 
    />
  </div>

  <!-- ✅ 国家精神文字区域：手动拖动 + 等比缩放 -->
  <div
    class="spirit-text-box"
    :class="{ 'spirit-text-locked': isLocked }"
    :style="{
      position: 'absolute',
      left: state.spiritTextsPos.x + 'px',
      top: state.spiritTextsPos.y + 'px',
      width: state.spiritTextsPos.w + 'px',
      height: state.spiritTextsPos.h + 'px',
      zIndex: 9999,
      cursor: isLocked ? 'default' : 'move',
    }"
    @mousedown="startDrag"
  >
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
    ">
      <div contenteditable="true"
           @blur="(e) => { state.spiritTexts[0] = e.target.innerText }"
           @keydown.enter.prevent
           @mousedown.stop
           :style="{
             outline: 'none',
             fontFamily: 'Aldrich, FZRui',
             fontSize: spiritFontSize(),
             color: '#e6e6e6',
             textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
             padding: '0px 4px',
             borderRadius: '2px',
           }">
        {{ state.spiritTexts[0] }}
      </div>
      <div contenteditable="true"
           @blur="(e) => { state.spiritTexts[1] = e.target.innerText }"
           @keydown.enter.prevent
           @mousedown.stop
           :style="{
             outline: 'none',
             fontFamily: 'Aldrich, FZRui',
             fontSize: spiritFontSize(),
             color: '#e6e6e6',
             textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
             padding: '0px 4px',
             borderRadius: '2px',
           }">
        {{ state.spiritTexts[1] }}
      </div>
      <div contenteditable="true"
           @blur="(e) => { state.spiritTexts[2] = e.target.innerText }"
           @keydown.enter.prevent
           @mousedown.stop
           :style="{
             outline: 'none',
             fontFamily: 'Aldrich, FZRui',
             fontSize: spiritFontSize(),
             color: '#e6e6e6',
             textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
             padding: '0px 4px',
             borderRadius: '2px',
           }">
        {{ state.spiritTexts[2] }}
      </div>
    </div>

    <!-- ✅ 左下角缩放手柄 -->
    <div
      v-if="!isLocked"
      @mousedown="startResize"
      style="
        position: absolute;
        left: -1px;
        bottom: -4px;
        width: 10px;
        height: 10px;
        background: #7caaaa;
        border: 1px solid #000;
        cursor: nesw-resize;
        z-index: 10000;
      "
    ></div>
  </div>

  <SpiritManager 
    v-model:visible="spiritManagerVisible" 
    v-model:spirits="localPictures"
    @update:visible="onVisibleChange"
  />
</template>

<style scoped>
.spirit-icons-container:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 悬停显示边框 */
.spirit-text-box {
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
  border: 1px dashed transparent;
  pointer-events: auto;
  box-sizing: border-box;
}

.spirit-text-box:hover {
  border: 1px dashed #7caaaa;
  box-shadow: 0 0 8px rgba(124, 170, 170, 0.5);
}

/* 固定状态：不显示边框 */
.spirit-text-box.spirit-text-locked:hover {
  border: 1px dashed transparent;
  box-shadow: none;
  cursor: default;
}
</style>