/**
 * 應用程式主入口
 * 整合遊戲引擎和 UI 控制器，處理所有事件
 */

// 全域變數
let gameEngine;
let uiController;
let timerInterval = null;

/**
 * 初始化應用程式
 */
function init() {
  // 創建遊戲引擎和 UI 控制器
  gameEngine = new GameEngine();
  uiController = new UIController(gameEngine);

  // 綁定事件監聽器
  bindEvents();

  // 顯示開始畫面
  uiController.showScreen('start');
}

/**
 * 綁定所有事件監聽器
 */
function bindEvents() {
  // 開始遊戲按鈕
  uiController.startBtn.addEventListener('click', startGame);

  // 返回按鈕
  uiController.backBtn.addEventListener('click', () => {
    if (confirm('確定要離開遊戲嗎？進度將不會保存。')) {
      uiController.showScreen('start');
      gameEngine.reset();
    }
  });

  // 重新開始按鈕
  uiController.restartBtn.addEventListener('click', startGame);

  // 鍵盤輸入支援
  document.addEventListener('keydown', handleKeyPress);
}

/**
 * 開始遊戲
 */
function startGame() {
  // 清除現有計時器
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // 重置 UI
  uiController.reset();

  // 開始新遊戲
  gameEngine.startGame({
    totalQuestions: 10,
    minTable: 1,
    maxTable: 9
  });

  // 顯示遊戲畫面
  uiController.showScreen('game');

  // 顯示第一題
  showQuestion();
}

/**
 * 顯示題目
 */
function showQuestion() {
  const question = gameEngine.getCurrentQuestion();
  
  if (!question) {
    // 沒有更多題目，遊戲結束
    endGame();
    return;
  }

  uiController.updateQuestion(question);
  uiController.updateProgress();
  
  // 啟動計時器
  startTimer();
}

/**
 * 啟動題目計時器
 */
function startTimer() {
  // 清除現有計時器
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // 取得當前難度的時間限制
  const timeLimit = gameEngine.getCurrentTimeLimit();
  let timeRemaining = timeLimit;
  
  // 初始化計時器顯示
  uiController.updateTimer(timeRemaining, timeLimit);
  
  // 每 100 毫秒更新一次
  timerInterval = setInterval(() => {
    timeRemaining -= 0.1;
    
    if (timeRemaining <= 0) {
      handleTimeOut();
    } else {
      uiController.updateTimer(timeRemaining, timeLimit);
    }
  }, 100);
}

/**
 * 處理答題超時
 */
function handleTimeOut() {
  // 停止計時器
  clearInterval(timerInterval);
  timerInterval = null;
  
  // 提交空答案（視為錯誤）
  if (uiController.getCurrentAnswer() === '') {
    const result = gameEngine.submitAnswer('');
    
    // 顯示超時回饋
    uiController.showFeedback({
      isCorrect: false,
      points: 0,
      feedback: '⏰ 時間到！',
      speedBonus: 0,
      streakBonus: 0,
      difficultyBonus: 0
    });
    
    // 更新分數
    uiController.updateScore();
    
    // 暫時禁用鍵盤
    uiController.setKeypadDisabled(true);
    
    // 1.5秒後載入下一題
    setTimeout(() => {
      uiController.setKeypadDisabled(false);
      
      if (gameEngine.isGameOver()) {
        endGame();
      } else {
        gameEngine.loadNextQuestion();
        showQuestion();
      }
    }, 1500);
  }
}

/**
 * 提交答案
 */
function submitAnswer() {
  const userAnswer = uiController.getCurrentAnswer();

  // 檢查是否有輸入答案
  if (!userAnswer) {
    return;
  }
  
  // 停止計時器
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // 提交答案到遊戲引擎
  const result = gameEngine.submitAnswer(userAnswer);

  if (!result) {
    return;
  }

  // 顯示回饋
  uiController.showFeedback(result);

  // 更新分數
  uiController.updateScore();
  
  // 檢查是否升級
  const levelUpResult = gameEngine.checkLevelUp();
  if (levelUpResult.leveledUp) {
    // 顯示升級通知
    setTimeout(() => {
      uiController.showLevelUpNotification(levelUpResult.newLevel);
      uiController.updateLevel(levelUpResult.newLevel);
    }, 800);
  }

  // 暫時禁用鍵盤
  uiController.setKeypadDisabled(true);

  // 1.5秒後載入下一題
  setTimeout(() => {
    uiController.setKeypadDisabled(false);

    if (gameEngine.isGameOver()) {
      endGame();
    } else {
      gameEngine.loadNextQuestion();
      showQuestion();
    }
  }, 1500);
}

/**
 * 結束遊戲
 */
function endGame() {
  // 清除計時器
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  const results = gameEngine.endGame();
  uiController.showResults(results);
}

/**
 * 處理鍵盤按鍵
 * @param {KeyboardEvent} event - 鍵盤事件
 */
function handleKeyPress(event) {
  // 只在遊戲畫面處理鍵盤輸入
  if (!uiController.gameScreen.classList.contains('active')) {
    return;
  }

  const key = event.key;

  // 數字鍵 0-9
  if (key >= '0' && key <= '9') {
    event.preventDefault();
    uiController.addDigit(key);
  }

  // Enter 鍵提交答案
  if (key === 'Enter') {
    event.preventDefault();
    submitAnswer();
  }

  // Backspace 或 Delete 鍵清除
  if (key === 'Backspace' || key === 'Delete') {
    event.preventDefault();
    uiController.clearAnswer();
  }

  // Escape 鍵返回
  if (key === 'Escape') {
    event.preventDefault();
    uiController.backBtn.click();
  }
}

/**
 * 頁面載入完成後初始化
 */
window.addEventListener('DOMContentLoaded', init);

// 防止意外離開頁面（遊戲進行中）
window.addEventListener('beforeunload', (event) => {
  if (gameEngine && gameEngine.isGameActive) {
    event.preventDefault();
    event.returnValue = '';
    return '';
  }
});
