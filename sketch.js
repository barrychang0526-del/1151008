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