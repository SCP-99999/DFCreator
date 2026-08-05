<script setup>
import { ref, watch, onMounted } from "vue";
import { state } from "@/utils/state";
import SpiritManager from "@/components/Controller/SpiritManager.vue";

const spiritManagerVisible = ref(false);

// 这个数组会双向绑定到 SpiritManager 内部
const localPictures = ref([]);

// ⭐ 页面一加载，立刻把全局数据同步到本地显示！
onMounted(() => {
  localPictures.value = state.spiritPictures.slice(0, 3);
});

const openSpiritManager = () => {
  // 打开弹窗前，保证只带 3 个进去
  localPictures.value = state.spiritPictures.slice(0, 3);
  spiritManagerVisible.value = true;
};

// ⚠️ 核心拦截器：只要弹窗里的数据一变化，立刻触发！
watch(
  () => localPictures.value,
  (newVal) => {
    if (newVal.length > 3) {
      // 1️⃣ 立刻弹出警告（此时弹窗还没关！）
      alert("最多只能添加三个国家精神！");
      
      // 2️⃣ 强行把当前的列表直接截断回 3 个
      localPictures.value = newVal.slice(0, 3);
      
      // 3️⃣ 同步阻断到全局 state，防止被意外保存
      state.spiritPictures = localPictures.value;
    }
  },
  { deep: true }
);

// 弹窗完全关闭时做最后的兜底
const onVisibleChange = (visible) => {
  if (!visible) {
    // 如果关窗时还有漏网之鱼，强行截断并保存最终的 3 个
    if (state.spiritPictures.length > 3) {
      state.spiritPictures = state.spiritPictures.slice(0, 3);
    }
  }
  spiritManagerVisible.value = visible;
};
</script>

<template>
  <div 
    class="spirit-icons-container" 
    @click="openSpiritManager"
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      gap: 0px;
      z-index: 20;
      padding: 10px;
      box-sizing: border-box;
    "
  >
    <!-- ⭐ 有了 onMounted 初始化，这里一加载就会显示出 3 个图标！ -->
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

  <!-- 这里使用 v-model 让 SpiritManager 直接改写 localPictures -->
  <!-- 一旦它改写，上面的 watch 就会立刻触发 -->
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
</style>