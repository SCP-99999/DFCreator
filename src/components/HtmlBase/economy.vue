<script setup>
import { state } from "@/utils/state.js";
</script>

<template>
  <!-- 外层容器 -->
  <div style="
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
      pointer-events: auto;
      width: max-content;
      position: relative;
    ">
    
    <!-- 左侧：经济图标（可以用 left/top 偏移） -->
    <div style="
        width: 50px; 
        height: 50px; 
        flex-shrink: 0;
        position: relative;
      ">
      <img id="econpic" 
           class="pic" 
           :src="state.economy.iconUrl" 
           data-modifiable="true"
           data-type="econ"
           data-target-id="econpic"
           data-resizable="true"
           style="
             position: absolute;
             left: 85px;       /* 这里调左右 */
             top: 5px;        /* 这里调上下 */
             width: 100%; 
             height: 100%; 
             object-fit: contain;
           " />
    </div>

    <!-- 右侧：文字列（使用 left 和 top 绝对定位） -->
    <div style="
        position: absolute;
        left: -20px;     /* 距离外层容器左边 65px */
        top: 35px;       /* 距离外层容器顶部 0px */
        display: flex;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        color: #ffffff;
        font-family: Bombard, FZWH;
        font-size: 14px;
        white-space: nowrap;
         z-index: 6
      ">
      <div contenteditable="true"
           @blur="(e) => { state.economy.text = e.target.innerText }"
           @keydown.enter.prevent
           style="
             outline: none;
             padding: 1px 4px;
             border-radius: 2px;
             transition: background 0.2s;
           "
      >{{ state.economy.text }}</div>
    </div>
  </div>
</template>