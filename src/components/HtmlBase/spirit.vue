<script setup>
import { ref, computed } from "vue";
import { state } from "@/utils/state";
import SpiritManager from "@/components/Controller/SpiritManager.vue";

const spiritManagerVisible = ref(false);

const openSpiritManager = () => {
  spiritManagerVisible.value = true;
};

// 只取前3个，没有就不显示
const pictures = computed({
  get: () => state.spiritPictures.slice(0, 3),
  set: (value) => {
    state.spiritPictures = value.slice(0, 3);
  }
});
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
    <!-- 只有已存在的图标，没有占位符，数量不够就直接留白 -->
    <img 
      v-for="(spirit, index) in pictures" 
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

  <SpiritManager v-model:visible="spiritManagerVisible" v-model:spirits="pictures" />
</template>

<style scoped>
.spirit-icons-container:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>