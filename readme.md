---
title: 選擇題測驗卷網站講義（學生版）.md

---

---
title: 選擇題測驗卷網站講義（學生版）

---

---
title: 選擇題測驗卷網站講義（學生版）
tags: [114程式設計與實習_上學期]

---

# 選擇題測驗卷網站講義（學生版）

學號：＿＿＿＿＿＿＿＿　　姓名：＿＿＿＿＿＿＿＿

> **填寫方式**
> 1. 每個學習都要放：**執行截圖**、**三次問 AI 的提示詞**、**最後採用的程式碼**。
> 2. 問 AI 的提示詞請**逐字貼上**自己實際輸入的內容（不要寫摘要），第一次、第二次、第三次依序記錄。
> 3. 程式碼貼在「點開貼上」的收合區塊裡，貼上**你最後真正採用、而且能執行**的版本。

---

## 學習1：產生一個選擇題測驗卷網站

https://cfchen58.synology.me/115/week4/stage1/

**這個階段的目標：** 用 p5.js 做出一個一次顯示一題、四個選項、答完會顯示對錯與總分的測驗網站（題目先寫在程式裡）。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![截圖 2026-10-08 下午1.45.54](https://hackmd.io/_uploads/r1uN0iVszg.png)

### 第一次問 AI

```tex!
使用 p5.js 撰寫一個選擇網頁的測驗系統，我已經撐生了一個p5.js專案，請把程式碼寫到sketch.js檔案內，每條指令都需要加上中文註解。測驗系統為五題
```

### 第二次問 AI

```tex!
題庫是要有關p5.js
```

### 第三次問 AI

```tex!
排版容易黏在一起幫我做個修整
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習1的程式碼
```javascript＝
// p5.js 觀念測驗 - 答對綠色/答錯紅色強化版
let questions = [
  {
    question: "p5.js 中，負責「設定畫布大小」的函式是哪一個？",
    options: ["setup()", "createCanvas()", "background()", "size()"],
    answer: 1
  },
  {
    question: "在預設情況下，draw() 函式一秒鐘大約會執行幾次？",
    options: ["10 次", "30 次", "60 次", "120 次"],
    answer: 2
  },
  {
    question: "p5.js 的座標系統中，原點 (0, 0) 位在畫布的哪個位置？",
    options: ["左下角", "正中間", "右上角", "左上角"],
    answer: 3
  },
  {
    question: "想要去除形狀的外框線，應該使用哪一個函式？",
    options: ["noStroke()", "noFill()", "removeBorder()", "stroke(0)"],
    answer: 0
  },
  {
    question: "預設變數 mouseX 與 mouseY 代表什麼？",
    options: ["滑鼠點擊的次數", "目前滑鼠游標的座標", "畫布的寬度與高度", "滑鼠滾輪的數值"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;
let gameState = "QUIZ"; 
let selectedOption = -1;
let isAnswered = false;

let optionButtons = [];
let nextButton;

// 動畫控制變數
let animOffsetX = 0; // 答錯：左右搖晃位移
let animOffsetY = 0; // 答對：上下跳動位移
let animTimer = 0;   // 動畫計時器

// 色彩調色盤定色
let COLOR_PRIMARY;
let COLOR_CORRECT;
let COLOR_WRONG;
let COLOR_BG;

function setup() {
  createCanvas(640, 480);
  
  // 定義色系 (RGB)
  COLOR_PRIMARY = color(59, 130, 246);  // 主色 (藍色 - 按鈕/標題)
  COLOR_CORRECT = color(40, 167, 69);   // 答對綠色
  COLOR_WRONG   = color(220, 53, 69);   // 答錯紅色
  COLOR_BG      = color(241, 245, 249); // 主背景 (莫蘭迪淡灰藍)
  
  // 計算選項按鈕位置
  for (let i = 0; i < 4; i++) {
    let y = 135 + i * 54;
    optionButtons.push({ x: 70, y: y, w: 500, h: 44 });
  }
  
  nextButton = { x: 230, y: 415, w: 180, h: 44 };
}

function draw() {
  background(COLOR_BG);
  
  // 更新動畫狀態
  updateAnimation();
  
  if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "RESULT") {
    drawResultScreen();
  }
}

function updateAnimation() {
  if (isAnswered && animTimer > 0) {
    animTimer--;
    
    let isCorrect = (selectedOption === questions[currentQuestion].answer);
    
    if (isCorrect) {
      // 答對：上下跳動 (正弦波彈跳)
      let bounce = sin((30 - animTimer) * 0.4) * 12;
      animOffsetY = -abs(bounce);
      animOffsetX = 0;
    } else {
      // 答錯：左右搖晃 (快速 Shake 震動)
      animOffsetX = sin((30 - animTimer) * 0.8) * 10;
      animOffsetY = 0;
    }
  } else {
    animOffsetX = 0;
    animOffsetY = 0;
  }
}

function drawQuizScreen() {
  let q = questions[currentQuestion];
  
  // 頂部進度標籤
  textAlign(CENTER, CENTER);
  fill(100, 116, 139);
  textSize(14);
  textStyle(NORMAL);
  text(`p5.js 觀念測驗  •  第 ${currentQuestion + 1} / ${questions.length} 題`, width / 2, 28);
  
  // 套用彈跳與搖晃動畫偏移
  push();
  translate(animOffsetX, animOffsetY);
  
  // 題目背景卡片
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(50, 48, 540, 68, 10);
  
  // 題目文字
  fill(30, 41, 59);
  noStroke();
  textSize(17);
  textStyle(BOLD);
  text(q.question, width / 2, 82);
  textStyle(NORMAL);
  
  // 繪製 4 個選項按鈕
  let prefixes = ["A", "B", "C", "D"];
  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    
    // 設定顏色邏輯
    let bgColor = color(255);
    let borderColor = color(226, 232, 240);
    let textColor = color(51, 65, 85);
    let prefixColor = color(148, 163, 184);
    
    if (isAnswered) {
      if (i === q.answer) {
        // 【答對：顯示鮮明綠色】
        bgColor = color(212, 237, 218);
        borderColor = COLOR_CORRECT;
        textColor = color(21, 87, 36);
        prefixColor = COLOR_CORRECT;
      } else if (i === selectedOption) {
        // 【選錯：顯示警告紅色】
        bgColor = color(248, 215, 218);
        borderColor = COLOR_WRONG;
        textColor = color(114, 28, 36);
        prefixColor = COLOR_WRONG;
      } else {
        bgColor = color(255);
        borderColor = color(241, 245, 249);
        textColor = color(148, 163, 184);
      }
    } else {
      // 尚未作答（懸停效果）
      if (isMouseOver(btn)) {
        bgColor = color(239, 246, 255);
        borderColor = COLOR_PRIMARY;
        prefixColor = COLOR_PRIMARY;
      }
    }
    
    // 畫按鈕底色與邊框
    fill(bgColor);
    stroke(borderColor);
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    
    // 繪製選項標號 (A/B/C/D) 與文字
    textAlign(LEFT, CENTER);
    noStroke();
    
    fill(prefixColor);
    textStyle(BOLD);
    textSize(14);
    text(`${prefixes[i]}.`, btn.x + 18, btn.y + btn.h / 2);
    
    fill(textColor);
    textStyle(NORMAL);
    textSize(15);
    text(q.options[i], btn.x + 44, btn.y + btn.h / 2);
  }
  
  // 即時對錯回饋文字欄
  textAlign(CENTER, CENTER);
  if (isAnswered) {
    if (selectedOption === q.answer) {
      fill(COLOR_CORRECT);
      textSize(15);
      textStyle(BOLD);
      text("🎉 正確！答對了！", width / 2, 382);
    } else {
      fill(COLOR_WRONG);
      textSize(15);
      textStyle(BOLD);
      text(`❌ 答錯了！正確答案是：${q.options[q.answer]}`, width / 2, 382);
    }
    textStyle(NORMAL);
  }
  
  pop(); // 恢復座標系統
  
  // 「下一題」按鈕
  if (isAnswered) {
    drawButton(nextButton, currentQuestion === questions.length - 1 ? "查看最終成績" : "下一題", COLOR_PRIMARY);
  }
}

function drawResultScreen() {
  textAlign(CENTER, CENTER);
  
  // 結算卡片
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(80, 50, 480, 280, 12);
  
  fill(30, 41, 59);
  textSize(26);
  textStyle(BOLD);
  text("p5.js 測驗結束！", width / 2, 110);
  
  textSize(20);
  textStyle(NORMAL);
  text(`你的總得分：${score} / ${questions.length}`, width / 2, 175);
  
  textSize(16);
  fill(100, 116, 139);
  let percentage = score / questions.length;
  if (percentage === 1) {
    fill(COLOR_CORRECT);
    text("🏆 太強了！你是 p5.js 大師！", width / 2, 235);
  } else if (percentage >= 0.6) {
    fill(COLOR_PRIMARY);
    text("👍 觀念很清晰，表現優良！", width / 2, 235);
  } else {
    fill(COLOR_WRONG);
    text("💪 加油！多練習幾次會更熟練喔！", width / 2, 235);
  }
  
  // 重新測驗按鈕 (使用翡翠綠)
  drawButton({ x: 230, y: 360, w: 180, h: 46 }, "重新測驗", COLOR_CORRECT);
}

function drawButton(btn, label, bgBtnColor) {
  rectMode(CORNER);
  if (isMouseOver(btn)) {
    fill(red(bgBtnColor) - 20, green(bgBtnColor) - 20, blue(bgBtnColor) - 20);
  } else {
    fill(bgBtnColor);
  }
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(15);
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function mousePressed() {
  if (gameState === "QUIZ") {
    if (!isAnswered) {
      for (let i = 0; i < 4; i++) {
        let btn = optionButtons[i];
        if (isMouseOverWithOffset(btn, animOffsetX, animOffsetY)) {
          selectedOption = i;
          isAnswered = true;
          animTimer = 30; // 觸發 30 幀動畫 (約 0.5 秒)
          
          if (i === questions[currentQuestion].answer) {
            score++;
          }
          break;
        }
      }
    } else {
      if (isMouseOver(nextButton)) {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          isAnswered = false;
          selectedOption = -1;
          animTimer = 0;
        } else {
          gameState = "RESULT";
        }
      }
    }
  } else if (gameState === "RESULT") {
    let restartBtn = { x: 230, y: 360, w: 180, h: 46 };
    if (isMouseOver(restartBtn)) {
      currentQuestion = 0;
      score = 0;
      isAnswered = false;
      selectedOption = -1;
      animTimer = 0;
      gameState = "QUIZ";
    }
  }
}

function isMouseOver(btn) {
  return mouseX > btn.x && mouseX < btn.x + btn.w &&
         mouseY > btn.y && mouseY < btn.y + btn.h;
}

function isMouseOverWithOffset(btn, offsetX, offsetY) {
  return mouseX > (btn.x + offsetX) && mouseX < (btn.x + btn.w + offsetX) &&
         mouseY > (btn.y + offsetY) && mouseY < (btn.y + btn.h + offsetY);
}
```
:::


---

## 學習2：網頁設定為響應式網頁

https://cfchen58.synology.me/115/week4/stage2/

**這個階段的目標：** 讓網站在電腦、平板、手機（直向與橫向）都能正常顯示，視窗大小改變時版面自動調整。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

![截圖 2026-10-08 下午1.45.54](https://hackmd.io/_uploads/SJ0mU2EoGl.png)

![螢幕錄影 2026-10-08 下午3](https://hackmd.io/_uploads/HyT5GaVizg.gif)





### 第一次問 AI

```tex!
請幫我把這個程式的網頁設定為響應式網頁未來要放在github
```

### 第二次問 AI

```tex!
幫我初始是全螢幕的狀態
```

### 第三次問 AI

```tex!

```

### 程式碼內容

:::info
:::spoiler 點開貼上學習2的程式碼
```javascript=
// p5.js 觀念測驗 - 全螢幕響應式版本
let questions = [
  {
    question: "p5.js 中，負責「設定畫布大小」的函式是哪一個？",
    options: ["setup()", "createCanvas()", "background()", "size()"],
    answer: 1
  },
  {
    question: "在預設情況下，draw() 函式一秒鐘大約會執行幾次？",
    options: ["10 次", "30 次", "60 次", "120 次"],
    answer: 2
  },
  {
    question: "p5.js 的座標系統中，原點 (0, 0) 位在畫布的哪個位置？",
    options: ["左下角", "正中間", "右上角", "左上角"],
    answer: 3
  },
  {
    question: "想要去除形狀的外框線，應該使用哪一個函式？",
    options: ["noStroke()", "noFill()", "removeBorder()", "stroke(0)"],
    answer: 0
  },
  {
    question: "預設變數 mouseX 與 mouseY 代表什麼？",
    options: ["滑鼠點擊的次數", "目前滑鼠游標的座標", "畫布的寬度與高度", "滑鼠滾輪的數值"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;
let gameState = "QUIZ"; 
let selectedOption = -1;
let isAnswered = false;

let optionButtons = [];
let nextButton;

// 動畫控制變數
let animOffsetX = 0;
let animOffsetY = 0;
let animTimer = 0;

// 色彩系統
let COLOR_PRIMARY;
let COLOR_CORRECT;
let COLOR_WRONG;
let COLOR_BG;

function setup() {
  // 建立與全螢幕視窗等大的畫布
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  COLOR_PRIMARY = color(59, 130, 246);
  COLOR_CORRECT = color(40, 167, 69);
  COLOR_WRONG   = color(220, 53, 69);
  COLOR_BG      = color(241, 245, 249);
  
  // 計算 UI 位置
  recalculateLayout();
}

// 根據當前視窗寬高動態重算按鈕與卡片尺寸
function recalculateLayout() {
  optionButtons = [];
  
  let cardWidth = min(width * 0.85, 540);
  let cardX = (width - cardWidth) / 2;
  
  // 按鈕尺寸
  let btnW = cardWidth;
  let btnH = min(height * 0.08, 48);
  let startY = height * 0.28;
  let gap = btnH + 12;
  
  for (let i = 0; i < 4; i++) {
    optionButtons.push({ x: cardX, y: startY + i * gap, w: btnW, h: btnH });
  }
  
  // 下一題按鈕位置 (畫面下方)
  let nextW = min(width * 0.4, 180);
  nextButton = { x: (width - nextW) / 2, y: startY + 4 * gap + 20, w: nextW, h: 46 };
}

function windowResized() {
  // 當視窗縮放或手機轉向時重新調整畫布尺寸
  resizeCanvas(windowWidth, windowHeight);
  recalculateLayout();
}

function draw() {
  background(COLOR_BG);
  
  updateAnimation();
  
  if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "RESULT") {
    drawResultScreen();
  }
}

function updateAnimation() {
  if (isAnswered && animTimer > 0) {
    animTimer--;
    let isCorrect = (selectedOption === questions[currentQuestion].answer);
    
    if (isCorrect) {
      let bounce = sin((30 - animTimer) * 0.4) * 12;
      animOffsetY = -abs(bounce);
      animOffsetX = 0;
    } else {
      animOffsetX = sin((30 - animTimer) * 0.8) * 10;
      animOffsetY = 0;
    }
  } else {
    animOffsetX = 0;
    animOffsetY = 0;
  }
}

function drawQuizScreen() {
  let q = questions[currentQuestion];
  let cardWidth = min(width * 0.85, 540);
  let cardX = (width - cardWidth) / 2;
  
  // 頂部進度標籤
  textAlign(CENTER, CENTER);
  fill(100, 116, 139);
  textSize(min(width * 0.035, 14));
  textStyle(NORMAL);
  text(`p5.js 觀念測驗  •  第 ${currentQuestion + 1} / ${questions.length} 題`, width / 2, height * 0.06);
  
  push();
  translate(animOffsetX, animOffsetY);
  
  // 題目背景卡片
  let questionCardH = min(height * 0.14, 75);
  let questionCardY = height * 0.10;
  
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(cardX, questionCardY, cardWidth, questionCardH, 12);
  
  // 題目文字
  fill(30, 41, 59);
  noStroke();
  textSize(min(width * 0.04, 18));
  textStyle(BOLD);
  text(q.question, width / 2, questionCardY + questionCardH / 2);
  textStyle(NORMAL);
  
  // 選項按鈕
  let prefixes = ["A", "B", "C", "D"];
  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    
    let bgColor = color(255);
    let borderColor = color(226, 232, 240);
    let textColor = color(51, 65, 85);
    let prefixColor = color(148, 163, 184);
    
    if (isAnswered) {
      if (i === q.answer) {
        bgColor = color(212, 237, 218);
        borderColor = COLOR_CORRECT;
        textColor = color(21, 87, 36);
        prefixColor = COLOR_CORRECT;
      } else if (i === selectedOption) {
        bgColor = color(248, 215, 218);
        borderColor = COLOR_WRONG;
        textColor = color(114, 28, 36);
        prefixColor = COLOR_WRONG;
      } else {
        bgColor = color(255);
        borderColor = color(241, 245, 249);
        textColor = color(148, 163, 184);
      }
    } else {
      if (isMouseOver(btn)) {
        bgColor = color(239, 246, 255);
        borderColor = COLOR_PRIMARY;
        prefixColor = COLOR_PRIMARY;
      }
    }
    
    fill(bgColor);
    stroke(borderColor);
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    
    textAlign(LEFT, CENTER);
    noStroke();
    
    fill(prefixColor);
    textStyle(BOLD);
    textSize(min(width * 0.035, 15));
    text(`${prefixes[i]}.`, btn.x + 18, btn.y + btn.h / 2);
    
    fill(textColor);
    textStyle(NORMAL);
    textSize(min(width * 0.038, 16));
    text(q.options[i], btn.x + 44, btn.y + btn.h / 2);
  }
  
  // 即時對錯提示
  textAlign(CENTER, CENTER);
  if (isAnswered) {
    let feedbackY = nextButton.y - 18;
    if (selectedOption === q.answer) {
      fill(COLOR_CORRECT);
      textSize(min(width * 0.038, 16));
      textStyle(BOLD);
      text("🎉 正確！答對了！", width / 2, feedbackY);
    } else {
      fill(COLOR_WRONG);
      textSize(min(width * 0.038, 16));
      textStyle(BOLD);
      text(`❌ 答錯了！正確答案是：${q.options[q.answer]}`, width / 2, feedbackY);
    }
    textStyle(NORMAL);
  }
  
  pop();
  
  if (isAnswered) {
    drawButton(nextButton, currentQuestion === questions.length - 1 ? "查看最終成績" : "下一題", COLOR_PRIMARY);
  }
}

function drawResultScreen() {
  textAlign(CENTER, CENTER);
  
  let cardW = min(width * 0.85, 480);
  let cardH = min(height * 0.5, 300);
  let cardX = (width - cardW) / 2;
  let cardY = (height - cardH) / 2 - 20;
  
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 12);
  
  fill(30, 41, 59);
  textSize(min(width * 0.055, 26));
  textStyle(BOLD);
  text("p5.js 測驗結束！", width / 2, cardY + cardH * 0.25);
  
  textSize(min(width * 0.045, 20));
  textStyle(NORMAL);
  text(`你的總得分：${score} / ${questions.length}`, width / 2, cardY + cardH * 0.5);
  
  textSize(min(width * 0.038, 16));
  fill(100, 116, 139);
  let percentage = score / questions.length;
  if (percentage === 1) {
    fill(COLOR_CORRECT);
    text("🏆 太強了！你是 p5.js 大師！", width / 2, cardY + cardH * 0.72);
  } else if (percentage >= 0.6) {
    fill(COLOR_PRIMARY);
    text("👍 觀念很清晰，表現優良！", width / 2, cardY + cardH * 0.72);
  } else {
    fill(COLOR_WRONG);
    text("💪 加油！多練習幾次會更熟練喔！", width / 2, cardY + cardH * 0.72);
  }
  
  let restartBtnW = min(width * 0.4, 180);
  let restartBtn = { x: (width - restartBtnW) / 2, y: cardY + cardH + 25, w: restartBtnW, h: 46 };
  drawButton(restartBtn, "重新測驗", COLOR_CORRECT);
}

function drawButton(btn, label, bgBtnColor) {
  rectMode(CORNER);
  if (isMouseOver(btn)) {
    fill(red(bgBtnColor) - 20, green(bgBtnColor) - 20, blue(bgBtnColor) - 20);
  } else {
    fill(bgBtnColor);
  }
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width * 0.038, 15));
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function mousePressed() {
  if (gameState === "QUIZ") {
    if (!isAnswered) {
      for (let i = 0; i < 4; i++) {
        let btn = optionButtons[i];
        if (isMouseOverWithOffset(btn, animOffsetX, animOffsetY)) {
          selectedOption = i;
          isAnswered = true;
          animTimer = 30;
          
          if (i === questions[currentQuestion].answer) {
            score++;
          }
          break;
        }
      }
    } else {
      if (isMouseOver(nextButton)) {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          isAnswered = false;
          selectedOption = -1;
          animTimer = 0;
        } else {
          gameState = "RESULT";
        }
      }
    }
  } else if (gameState === "RESULT") {
    let restartBtnW = min(width * 0.4, 180);
    let cardH = min(height * 0.5, 300);
    let cardY = (height - cardH) / 2 - 20;
    let restartBtn = { x: (width - restartBtnW) / 2, y: cardY + cardH + 25, w: restartBtnW, h: 46 };
    
    if (isMouseOver(restartBtn)) {
      currentQuestion = 0;
      score = 0;
      isAnswered = false;
      selectedOption = -1;
      animTimer = 0;
      gameState = "QUIZ";
    }
  }
}

function isMouseOver(btn) {
  return mouseX > btn.x && mouseX < btn.x + btn.w &&
         mouseY > btn.y && mouseY < btn.y + btn.h;
}

function isMouseOverWithOffset(btn, offsetX, offsetY) {
  return mouseX > (btn.x + offsetX) && mouseX < (btn.x + btn.w + offsetX) &&
         mouseY > (btn.y + offsetY) && mouseY < (btn.y + btn.h + offsetY);
}ㄋ

```
:::


---

## 學習3：設定嵌入 Google 字型，網頁文字採用這些字型

https://cfchen58.synology.me/115/week4/stage3/

**這個階段的目標：** 從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
**這個階段會修改的檔案：** index.html、sketch.js

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![截圖 2026-10-08 下午2.41.02](https://hackmd.io/_uploads/ByRfs34jfl.png)


### 第一次問 AI

```tex!
從 Google Fonts 嵌入繁體中文字型，並讓畫布上的題目與選項文字使用這些字型。
```

### 第二次問 AI

```tex!

```

### 第三次問 AI

```tex!

```

### 程式碼內容

:::info
:::spoiler 點開貼上學習3的程式碼
```javascript=
// p5.js 觀念測驗 - 套用 Google Fonts 繁體中文字型
let questions = [
  {
    question: "p5.js 中，負責「設定畫布大小」的函式是哪一個？",
    options: ["setup()", "createCanvas()", "background()", "size()"],
    answer: 1
  },
  {
    question: "在預設情況下，draw() 函式一秒鐘大約會執行幾次？",
    options: ["10 次", "30 次", "60 次", "120 次"],
    answer: 2
  },
  {
    question: "p5.js 的座標系統中，原點 (0, 0) 位在畫布的哪個位置？",
    options: ["左下角", "正中間", "右上角", "左上角"],
    answer: 3
  },
  {
    question: "想要去除形狀的外框線，應該使用哪一個函式？",
    options: ["noStroke()", "noFill()", "removeBorder()", "stroke(0)"],
    answer: 0
  },
  {
    question: "預設變數 mouseX 與 mouseY 代表什麼？",
    options: ["滑鼠點擊的次數", "目前滑鼠游標的座標", "畫布的寬度與高度", "滑鼠滾輪的數值"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;
let gameState = "QUIZ"; 
let selectedOption = -1;
let isAnswered = false;

let optionButtons = [];
let nextButton;

// 動畫變數
let animOffsetX = 0;
let animOffsetY = 0;
let animTimer = 0;

// 色彩系統
let COLOR_PRIMARY;
let COLOR_CORRECT;
let COLOR_WRONG;
let COLOR_BG;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  
  // 指定 p5.js 文字繪製使用 Google Fonts 的 Noto Sans TC
  textFont('Noto Sans TC');
  
  COLOR_PRIMARY = color(59, 130, 246);
  COLOR_CORRECT = color(40, 167, 69);
  COLOR_WRONG   = color(220, 53, 69);
  COLOR_BG      = color(241, 245, 249);
  
  recalculateLayout();
}

function recalculateLayout() {
  optionButtons = [];
  
  let cardWidth = min(width * 0.85, 540);
  let cardX = (width - cardWidth) / 2;
  
  let btnW = cardWidth;
  let btnH = min(height * 0.08, 48);
  let startY = height * 0.28;
  let gap = btnH + 12;
  
  for (let i = 0; i < 4; i++) {
    optionButtons.push({ x: cardX, y: startY + i * gap, w: btnW, h: btnH });
  }
  
  let nextW = min(width * 0.4, 180);
  nextButton = { x: (width - nextW) / 2, y: startY + 4 * gap + 20, w: nextW, h: 46 };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  recalculateLayout();
}

function draw() {
  background(COLOR_BG);
  
  updateAnimation();
  
  if (gameState === "QUIZ") {
    drawQuizScreen();
  } else if (gameState === "RESULT") {
    drawResultScreen();
  }
}

function updateAnimation() {
  if (isAnswered && animTimer > 0) {
    animTimer--;
    let isCorrect = (selectedOption === questions[currentQuestion].answer);
    
    if (isCorrect) {
      let bounce = sin((30 - animTimer) * 0.4) * 12;
      animOffsetY = -abs(bounce);
      animOffsetX = 0;
    } else {
      animOffsetX = sin((30 - animTimer) * 0.8) * 10;
      animOffsetY = 0;
    }
  } else {
    animOffsetX = 0;
    animOffsetY = 0;
  }
}

function drawQuizScreen() {
  let q = questions[currentQuestion];
  let cardWidth = min(width * 0.85, 540);
  let cardX = (width - cardWidth) / 2;
  
  // 頂部進度標籤
  textAlign(CENTER, CENTER);
  fill(100, 116, 139);
  textSize(min(width * 0.035, 14));
  textStyle(NORMAL);
  text(`p5.js 觀念測驗  •  第 ${currentQuestion + 1} / ${questions.length} 題`, width / 2, height * 0.06);
  
  push();
  translate(animOffsetX, animOffsetY);
  
  // 題目背景卡片
  let questionCardH = min(height * 0.14, 75);
  let questionCardY = height * 0.10;
  
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(cardX, questionCardY, cardWidth, questionCardH, 12);
  
  // 題目文字 (使用 Noto Sans TC Bold)
  fill(30, 41, 59);
  noStroke();
  textSize(min(width * 0.04, 18));
  textStyle(BOLD);
  text(q.question, width / 2, questionCardY + questionCardH / 2);
  textStyle(NORMAL);
  
  // 選項按鈕
  let prefixes = ["A", "B", "C", "D"];
  for (let i = 0; i < 4; i++) {
    let btn = optionButtons[i];
    
    let bgColor = color(255);
    let borderColor = color(226, 232, 240);
    let textColor = color(51, 65, 85);
    let prefixColor = color(148, 163, 184);
    
    if (isAnswered) {
      if (i === q.answer) {
        bgColor = color(212, 237, 218);
        borderColor = COLOR_CORRECT;
        textColor = color(21, 87, 36);
        prefixColor = COLOR_CORRECT;
      } else if (i === selectedOption) {
        bgColor = color(248, 215, 218);
        borderColor = COLOR_WRONG;
        textColor = color(114, 28, 36);
        prefixColor = COLOR_WRONG;
      } else {
        bgColor = color(255);
        borderColor = color(241, 245, 249);
        textColor = color(148, 163, 184);
      }
    } else {
      if (isMouseOver(btn)) {
        bgColor = color(239, 246, 255);
        borderColor = COLOR_PRIMARY;
        prefixColor = COLOR_PRIMARY;
      }
    }
    
    fill(bgColor);
    stroke(borderColor);
    strokeWeight(1.5);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    
    textAlign(LEFT, CENTER);
    noStroke();
    
    fill(prefixColor);
    textStyle(BOLD);
    textSize(min(width * 0.035, 15));
    text(`${prefixes[i]}.`, btn.x + 18, btn.y + btn.h / 2);
    
    fill(textColor);
    textStyle(NORMAL);
    textSize(min(width * 0.038, 16));
    text(q.options[i], btn.x + 44, btn.y + btn.h / 2);
  }
  
  // 對錯提示
  textAlign(CENTER, CENTER);
  if (isAnswered) {
    let feedbackY = nextButton.y - 18;
    if (selectedOption === q.answer) {
      fill(COLOR_CORRECT);
      textSize(min(width * 0.038, 16));
      textStyle(BOLD);
      text("🎉 正確！答對了！", width / 2, feedbackY);
    } else {
      fill(COLOR_WRONG);
      textSize(min(width * 0.038, 16));
      textStyle(BOLD);
      text(`❌ 答錯了！正確答案是：${q.options[q.answer]}`, width / 2, feedbackY);
    }
    textStyle(NORMAL);
  }
  
  pop();
  
  if (isAnswered) {
    drawButton(nextButton, currentQuestion === questions.length - 1 ? "查看最終成績" : "下一題", COLOR_PRIMARY);
  }
}

function drawResultScreen() {
  textAlign(CENTER, CENTER);
  
  let cardW = min(width * 0.85, 480);
  let cardH = min(height * 0.5, 300);
  let cardX = (width - cardW) / 2;
  let cardY = (height - cardH) / 2 - 20;
  
  rectMode(CORNER);
  fill(255);
  stroke(226, 232, 240);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 12);
  
  fill(30, 41, 59);
  textSize(min(width * 0.055, 26));
  textStyle(BOLD);
  text("p5.js 測驗結束！", width / 2, cardY + cardH * 0.25);
  
  textSize(min(width * 0.045, 20));
  textStyle(NORMAL);
  text(`你的總得分：${score} / ${questions.length}`, width / 2, cardY + cardH * 0.5);
  
  textSize(min(width * 0.038, 16));
  fill(100, 116, 139);
  let percentage = score / questions.length;
  if (percentage === 1) {
    fill(COLOR_CORRECT);
    text("🏆 太強了！你是 p5.js 大師！", width / 2, cardY + cardH * 0.72);
  } else if (percentage >= 0.6) {
    fill(COLOR_PRIMARY);
    text("👍 觀念很清晰，表現優良！", width / 2, cardY + cardH * 0.72);
  } else {
    fill(COLOR_WRONG);
    text("💪 加油！多練習幾次會更熟練喔！", width / 2, cardY + cardH * 0.72);
  }
  
  let restartBtnW = min(width * 0.4, 180);
  let restartBtn = { x: (width - restartBtnW) / 2, y: cardY + cardH + 25, w: restartBtnW, h: 46 };
  drawButton(restartBtn, "重新測驗", COLOR_CORRECT);
}

function drawButton(btn, label, bgBtnColor) {
  rectMode(CORNER);
  if (isMouseOver(btn)) {
    fill(red(bgBtnColor) - 20, green(bgBtnColor) - 20, blue(bgBtnColor) - 20);
  } else {
    fill(bgBtnColor);
  }
  noStroke();
  rect(btn.x, btn.y, btn.w, btn.h, 8);
  
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width * 0.038, 15));
  textStyle(BOLD);
  text(label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  textStyle(NORMAL);
}

function mousePressed() {
  if (gameState === "QUIZ") {
    if (!isAnswered) {
      for (let i = 0; i < 4; i++) {
        let btn = optionButtons[i];
        if (isMouseOverWithOffset(btn, animOffsetX, animOffsetY)) {
          selectedOption = i;
          isAnswered = true;
          animTimer = 30;
          
          if (i === questions[currentQuestion].answer) {
            score++;
          }
          break;
        }
      }
    } else {
      if (isMouseOver(nextButton)) {
        if (currentQuestion < questions.length - 1) {
          currentQuestion++;
          isAnswered = false;
          selectedOption = -1;
          animTimer = 0;
        } else {
          gameState = "RESULT";
        }
      }
    }
  } else if (gameState === "RESULT") {
    let restartBtnW = min(width * 0.4, 180);
    let cardH = min(height * 0.5, 300);
    let cardY = (height - cardH) / 2 - 20;
    let restartBtn = { x: (width - restartBtnW) / 2, y: cardY + cardH + 25, w: restartBtnW, h: 46 };
    
    if (isMouseOver(restartBtn)) {
      currentQuestion = 0;
      score = 0;
      isAnswered = false;
      selectedOption = -1;
      animTimer = 0;
      gameState = "QUIZ";
    }
  }
}

function isMouseOver(btn) {
  return mouseX > btn.x && mouseX < btn.x + btn.w &&
         mouseY > btn.y && mouseY < btn.y + btn.h;
}

function isMouseOverWithOffset(btn, offsetX, offsetY) {
  return mouseX > (btn.x + offsetX) && mouseX < (btn.x + btn.w + offsetX) &&
         mouseY > (btn.y + offsetY) && mouseY < (btn.y + btn.h + offsetY);
}

```
:::


---

## 學習4：設定題庫並抽題顯示題目網頁（CSV 檔案）

https://cfchen58.synology.me/115/week4/stage4/

**這個階段的目標：** 把題目移到 questions.csv，網站讀取題庫後每次隨機抽出 5 題。
**這個階段會修改的檔案：** index.html、sketch.js、questions.csv

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習4截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習4的程式碼
```javascript=
//學習4程式碼所在

```
:::


---

## 學習5：利用 Google Sheets 當題庫

https://cfchen58.synology.me/115/week4/stage5/

**這個階段的目標：** 把題庫放在 Google 試算表，網站直接讀取，老師改試算表，網站題目就跟著更新。
**這個階段會修改的檔案：** index.html、sketch.js（questions.csv 當備用題庫）

### 執行截圖

（把截圖拖曳到這裡，或貼上圖片連結）

![學習5截圖](請貼上截圖)

### 第一次問 AI

```tex!
（逐字貼上你第一次問 AI 的提示詞）
```

### 第二次問 AI

```tex!
（逐字貼上你第二次問 AI 的提示詞）
```

### 第三次問 AI

```tex!
（逐字貼上你第三次問 AI 的提示詞）
```

### 程式碼內容

:::info
:::spoiler 點開貼上學習5的程式碼
```javascript=
//學習5程式碼所在

```
:::


---

## 我的心得

這五個學習中，哪一個最困難？你是怎麼解決的？（請寫出實際發生的事）

＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
