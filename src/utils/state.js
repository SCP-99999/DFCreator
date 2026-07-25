import { reactive, watch } from 'vue';
import { saveData } from "@/utils/onload.js";

export const state = reactive({
  // ============================================================
  //  1. 饼图数据
  // ============================================================
  chartData: {
    labels: [
      "秘传纳粹主义", "极端民族主义", "国家社会主义", "法西斯主义",
      "专制主义", "家长制民主", "保守主义", "自由保守主义",
      "自由主义", "进步主义", "社会主义", "共产主义"
    ],
    datasets: [{
      data: [0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0],
      backgroundColor: [
        "#341950", "#232323", "#503200", "#843200",
        "#4b4b4b", "#828282", "#000087", "#273195",
        "#4e61a3", "#a91b4f", "#9b0000", "#6e0000"
      ],
      borderWidth: 0,
      spacing: 0,
    }],
    options: { rotation: 90 },
  },

  // ============================================================
  //  2. 国家精神（图标 + 右侧文字）
  // ============================================================
  spiritPictures: [
    { id: 1, url: "/preset/Reich_GER_idea_GER_endsieg_old.png", filename: "Reich_GER_idea_GER_endsieg_old", scale: 1.0 },
    { id: 2, url: "/preset/Reich_GER_idea_GER_gone_over.png", filename: "Reich_GER_idea_GER_gone_over", scale: 1.0 },
    { id: 3, url: "/preset/Reich_GER_idea_GER_the_two_principles.png", filename: "Reich_GER_idea_GER_the_two_principles", scale: 1.0 },
    { id: 4, url: "/preset/Reich_GER_idea_GER_to_banish_want.png", filename: "Reich_GER_idea_GER_to_banish_want", scale: 1.0 },
  ],
  spiritTexts: ["1. 军阀割据", "2. 柏林之战", "3. 分崩离析的国家"],

  // ============================================================
  //  3. 领袖数据
  // ============================================================
  leaderName: "国会紧急委员会",

  // ============================================================
  //  4. 经济数据
  // ============================================================
  economy: {
    text: "纳粹法团经济",
    iconUrl: "/preset/Gelenkte_Wirtschaft.png"
  },

  // ============================================================
  //  5. 新闻报纸数据
  // ============================================================
  newsTitle: "德国内战",
  newsBody: "在阿道夫·希特勒去世后，德国旋即陷入混乱。尽管元首指定了合法的继任者，但德国国内的强大派系已经开始拿起武器，互相对抗，打算将国家引导向自己的期望。国家已被分裂，整支整支的驻军无视来自日耳曼尼亚的命令，并倒向他们选择的继任者。虽然局势的严重程度尚不清楚，但据估计，德国要么正在面临要么已经经历了中央权威的彻底崩溃。\n\n虽然还不大清楚德国东部领地的命运将会如何，但日耳曼尼亚与她的殖民领之间突然断绝了联系，这已经引发了这些地区是否也会自行寻找出路的猜测。然而，有一点毫无疑问，这个欧洲巨人的崩溃已经使整个欧陆陷入分崩离析之中。",
  newsOptionText: "帝国的终结。",

  // ============================================================
  //  6. 大选数据
  // ============================================================
  electionText: "无选举",

  // ============================================================
  //  7. 全局弹窗控制变量（供 PicManager 使用）
  // ============================================================
  picManagerVisible: false,
  picManagerType: "",
  picManagerTargetId: "",
  picManagerResizable: false,

  // ============================================================
  //  8. 窗口布局
  // ============================================================
  windows: {
    main: { name: "主窗口", x: 0, y: 0, w: 1, h: 1, zIndex: 1, visible: true, active: false },
    description: { name: "人物介绍", x: 600, y: 4000, w: 310, h: 400, zIndex: 1, visible: true, active: false },
    superevent: { name: "超事件", x: 330, y: 240, w: 1, h: 1, zIndex: 1, visible: true, active: false },
    event: { name: "事件", x: 600, y: 0, w: 1, h: 1, zIndex: 1, visible: false, active: false },
  }
});

// 深度监听，自动保存一切改动
watch(state, () => { saveData(); }, { deep: true });