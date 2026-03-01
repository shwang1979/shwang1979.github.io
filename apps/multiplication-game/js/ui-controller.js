/**
 * UI 控制器
 * 管理所有 UI 元素的顯示和互動
 */

class UIController {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentAnswer = '';
    this.initElements();
  }

  /**
   * 初始化 DOM 元素參考
   */
  initElements() {
    // 畫面
    this.startScreen = document.getElementById('start-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.resultScreen = document.getElementById('result-screen');

    // 開始畫面
    this.startBtn = document.getElementById('start-btn');

    // 遊戲畫面
    this.backBtn = document.getElementById('back-btn');
    this.levelDisplay = document.getElementById('level');
    this.scoreDisplay = document.getElementById('score');
    this.moodIcon = document.getElementById('mood-icon');
    this.timerDisplay = document.getElementById('timer-display');
    this.timerFill = document.getElementById('timer-fill');
    this.progress = document.getElementById('progress');
    this.currentQuestionDisplay = document.getElementById('current-question');
    this.totalQuestionsDisplay = document.getElementById('total-questions');
    this.multiplicandDisplay = document.getElementById('multiplicand');
    this.multiplierDisplay = document.getElementById('multiplier');
this.answerDisplay = document.getElementById('answer-display');
    this.feedback = document.getElementById('feedback');
    
    // 鍵盤按鈕
    this.numberKeys = document.querySelectorAll('.number-key');
    this.clearBtn = document.getElementById('clear-btn');
    this.submitBtn = document.getElementById('submit-btn');

    // 結果畫面
    this.resultEmoji = document.getElementById('result-emoji');
    this.resultTitle = document.getElementById('result-title');
    this.finalLevel = document.getElementById('final-level');
    this.finalScore = document.getElementById('final-score');
    this.correctCountDisplay = document.getElementById('correct-count');
    this.wrongCountDisplay = document.getElementById('wrong-count');
    this.resultMessage = document.getElementById('result-message');
    this.restartBtn = document.getElementById('restart-btn');
  }

  /**
   * 顯示指定的畫面
   * @param {string} screen - 畫面名稱 ('start', 'game', 'result')
   */
  showScreen(screen) {
    this.startScreen.classList.remove('active');
    this.gameScreen.classList.remove('active');
    this.resultScreen.classList.remove('active');

    switch (screen) {
      case 'start':
        this.startScreen.classList.add('active');
        break;
      case 'game':
        this.gameScreen.classList.add('active');
        break;
      case 'result':
        this.resultScreen.classList.add('active');
        break;
    }
  }

  /**
   * 更新題目顯示
   * @param {Object} question - 題目物件
   */
  updateQuestion(question) {
    if (!question) return;

    this.multiplicandDisplay.textContent = question.multiplicand;
    this.multiplierDisplay.textContent = question.multiplier;
    
    // 重置答案和回饋
    this.currentAnswer = '';
    this.answerDisplay.textContent = '';
    this.feedback.textContent = '';
    this.feedback.className = 'feedback';
  }

  /**
   * 更新進度顯示
   */
  updateProgress() {
    const progressData = this.gameEngine.getProgress();
    this.currentQuestionDisplay.textContent = progressData.current;
    this.totalQuestionsDisplay.textContent = progressData.total;
    this.progress.style.width = `${progressData.percentage}%`;
  }

  /**
   * 更新分數顯示
   */
  updateScore() {
    const stats = this.gameEngine.getStats();
    this.scoreDisplay.textContent = stats.score;
    
    // 更新情緒圖示
    this.moodIcon.textContent = this.gameEngine.getMoodIcon();
    
    // 分數動畫
    this.scoreDisplay.classList.add('animate-correct');
    setTimeout(() => {
      this.scoreDisplay.classList.remove('animate-correct');
    }, 600);
  }

  /**
   * 更新等級顯示
   * @param {number} level - 等級
   */
  updateLevel(level) {
    this.levelDisplay.textContent = level;
    this.levelDisplay.classList.add('animate-correct');
    setTimeout(() => {
      this.levelDisplay.classList.remove('animate-correct');
    }, 600);
  }

  /**
   * 更新計時器
   * @param {number} timeRemaining - 剩餘時間（秒）
   * @param {number} timeLimit - 時間限制（秒）
   */
  updateTimer(timeRemaining, timeLimit) {
    this.timerDisplay.textContent = Math.ceil(timeRemaining);
    const percentage = (timeRemaining / timeLimit) * 100;
    this.timerFill.style.width = `${Math.max(0, percentage)}%`;
    
    // 根據剩餘時間改變顏色和動畫
    this.timerFill.classList.remove('warning', 'danger');
    this.timerDisplay.parentElement.classList.remove('warning', 'danger');
    
    if (percentage <= 30) {
      this.timerFill.classList.add('danger');
      this.timerDisplay.parentElement.classList.add('danger');
    } else if (percentage <= 50) {
      this.timerFill.classList.add('warning');
      this.timerDisplay.parentElement.classList.add('warning');
    }
  }

  /**
   * 顯示等級進級通知
   * @param {number} level - 新等級
   */
  showLevelUpNotification(level) {
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.textContent = `🎉 Level ${level}！`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  /**
   * 添加數字到答案
   * @param {string} digit - 數字字元
   */
  addDigit(digit) {
    if (this.currentAnswer.length < 3) { // 最多3位數
      this.currentAnswer += digit;
      this.answerDisplay.textContent = this.currentAnswer;
    }
  }

  /**
   * 清除答案
   */
  clearAnswer() {
    if (this.currentAnswer.length > 0) {
      this.currentAnswer = this.currentAnswer.slice(0, -1);
      this.answerDisplay.textContent = this.currentAnswer;
    }
  }

  /**
   * 顯示回饋訊息
   * @param {Object} result - 答題結果
   */
  showFeedback(result) {
    if (result.isCorrect) {
      this.feedback.textContent = `✅ ${result.feedback}`;
      this.feedback.className = 'feedback correct';
      
      // 成功動畫
      this.answerDisplay.classList.add('animate-correct');
      this.gameScreen.classList.add('success-flash');
      
      // 顯示得分
      this.showScorePopup(result.score);
    } else {
      this.feedback.textContent = `❌ ${result.feedback} (正確答案: ${result.correctAnswer})`;
      this.feedback.className = 'feedback wrong';
      
      // 錯誤動畫
      this.answerDisplay.classList.add('animate-wrong');
      this.gameScreen.classList.add('error-flash');
    }

    // 清除動畫 class
    setTimeout(() => {
      this.answerDisplay.classList.remove('animate-correct', 'animate-wrong');
      this.gameScreen.classList.remove('success-flash', 'error-flash');
    }, 600);

    // 顯示連擊
    if (result.streak >= 3) {
      this.showStreakNotification(result.streak);
    }
  }

  /**
   * 顯示得分彈出動畫
   * @param {number} score - 獲得的分數
   */
  showScorePopup(score) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${score}`;
    popup.style.left = '50%';
    popup.style.top = '40%';
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
      popup.remove();
    }, 1000);
  }

  /**
   * 顯示連擊通知
   * @param {number} streak - 連擊數
   */
  showStreakNotification(streak) {
    const streakDisplay = document.createElement('div');
    streakDisplay.className = 'streak-display';
    streakDisplay.textContent = `🔥 ${streak} 連擊！`;
    
    document.body.appendChild(streakDisplay);
    
    setTimeout(() => {
      streakDisplay.remove();
    }, 1500);
  }

  /**
   * 顯示結果畫面
   * @param {Object} results - 遊戲結果
   */
  showResults(results) {
    // 設定結果資料
    this.finalLevel.textContent = results.maxLevelReached;
    this.finalScore.textContent = results.score;
    this.correctCountDisplay.textContent = results.correctCount;
    this.wrongCountDisplay.textContent = results.wrongCount;
    this.resultMessage.textContent = results.resultMessage;

    // 根據正確率設定表情和標題
    const accuracy = parseFloat(results.accuracy);
    
    if (accuracy === 100) {
      this.resultEmoji.textContent = '🏆';
      this.resultTitle.textContent = '完美！';
    } else if (accuracy >= 90) {
      this.resultEmoji.textContent = '🌟';
      this.resultTitle.textContent = '太棒了！';
    } else if (accuracy >= 70) {
      this.resultEmoji.textContent = '😊';
      this.resultTitle.textContent = '做得好！';
    } else if (accuracy >= 50) {
      this.resultEmoji.textContent = '🙂';
      this.resultTitle.textContent = '不錯！';
    } else {
      this.resultEmoji.textContent = '💪';
      this.resultTitle.textContent = '繼續加油！';
    }

    // 顯示結果畫面
    this.showScreen('result');

    // 慶祝動畫（如果表現好）
    if (accuracy >= 80) {
      this.createConfetti();
    }
  }

  /**
   * 創建彩紙效果
   */
  createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 30);
    }
  }

  /**
   * 重置 UI
   */
  reset() {
    this.currentAnswer = '';
    this.answerDisplay.textContent = '';
    this.feedback.textContent = '';
    this.scoreDisplay.textContent = '0';
    this.levelDisplay.textContent = '1';
    this.timerDisplay.textContent = '10';
    this.timerFill.style.width = '100%';
    this.progress.style.width = '0%';
    this.updateProgress();
  }

  /**
   * 禁用鍵盤（答題後短暫禁用）
   * @param {boolean} disabled - 是否禁用
   */
  setKeypadDisabled(disabled) {
    this.numberKeys.forEach(key => {
      key.disabled = disabled;
    });
    this.clearBtn.disabled = disabled;
    this.submitBtn.disabled = disabled;
  }

  /**
   * 取得當前答案
   * @returns {string} 當前答案
   */
  getCurrentAnswer() {
    return this.currentAnswer;
  }
}

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}
