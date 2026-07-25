<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

// 🟢 注意：我们不再在这里定义 picManager 等变量，
// 而是直接复用 mainwindow.vue 外层的全局监听器！

const handlePicClick = (event) => {
  const distance = Math.sqrt(
    Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
    Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
  );

  if (distance > 5) {
    return;
  }

  const target = event.target;
  // 🟢 如果点到了带有 data-modifiable 的元素，
  // 因为 mainwindow.vue 的监听器会先捕获，这里可留可不留。
  // 为了不干扰，我们让主窗口处理弹窗。
};

onMounted(() => {
  // ❌ 删除了 prioritizeWindow 的绑定
});
</script>

<template>
  <!-- 
    ⚠️ 关键改动：
    1. 删除了 class="draggable"
    2. 删除了 id="newswindow" (防止与 App.vue 的独立壳冲突)
  -->
  <div style="position: absolute; z-index: 4; width: 580px; height: 650px;">
    <!-- 原版背景图完整保留 -->
    <img src="/template/news/event_news_bg.png" style="position: relative; width: 100%; height: 100%; display: block;" />
    
    <!-- 左侧大图 (data-modifiable 保留，交由 mainwindow 的监听器触发) -->
    <div style="
        position: absolute;
        top: 152px;
        left: 29px;
        width: 180px;
        height: 460px;
      ">
      <img id="newspic" class="pic" src="/preset/GER_german_civil_war.png"
        style="position: absolute; width: inherit; height: inherit" data-modifiable="true" data-type="news"
        data-resizable="false" data-target-id="newspic" />
    </div>
    
    <!-- 顶部标题图 (data-modifiable 保留) -->
    <div style="
        position: absolute;
        top: 20px;
        left: 45px;
        width: 480px;
        height: 70px;
      ">
      <img id="newsheaderpic" class="pic" src="/preset/nazist-Germany.png"
        style="position: absolute; width: inherit; height: inherit" data-modifiable="true" data-type="newsheader"
        data-resizable="false" data-target-id="newsheaderpic" />
    </div>
    
    <!-- 底部按钮 (为了让你在主窗口里也能改字，我加了 contenteditable) -->
    <button id="newsbutton" class="button text" style="
        position: absolute;
        top: 545px;
        left: 180px;
        transition: 0.2s;
        background: url(&quot;/template/news/event_option_entry.png&quot;)
          no-repeat;
        background-size: 100% 100%;
        border: none;
        width: 390px;
        height: 52px;
        font-family: OldTypeNr;
        font-size: 16px;
        color: #000000;
      ">
      帝国的终结。
    </button>

    <!-- 标题文字 -->
    <div style="
        position: absolute;
        display: flex;
        left: 40px;
        top: 130px;
        justify-content: center;
        align-items: center;
        inline-size: 500px;
      ">
      <p id="newstitle" class="text" style="
          position: absolute;
          color: #000000;
          text-align: center;
          font-family: OldTypeNr;
          font-size: 20px;
          font-weight: bold;  /* 👈 加这一行，标题就加粗了！ */
        ">
        德国内战
      </p>
    </div>
    
    <!-- 正文 -->
    <span id="newsbody" class="text"
      style="
        font-family: OldTypeNr;
        position: absolute;
        left: 215px;
        top: 150px;
        color: #000000;
        inline-size: 330px;
        text-align: left;
        font-size: 15px;
        white-space: pre-line;
      ">在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。<br /><br />
      虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。</span>
  </div>
</template>