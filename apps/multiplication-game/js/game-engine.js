/**
 * 遊戲引擎
 * 管理遊戲狀態、流程和計分邏輯
 */

class GameEngine {
  constructor() {
    this.questionGenerator = new QuestionGenerator();
    this.reset();
  }

  /**
   * 重置遊戲狀態
   */
  reset() {
    this.currentQuestion = null;
    this.currentQuestionIndex = 0;
    this.totalQuestions = 10; // 預設 10 題
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.streak = 0; // 連擊數
    this.maxStreak = 0; // 最高連擊
    this.startTime = null;
    this.questionStartTime = null;
    this.isGameActive = false;
    
    // 遊戲模式
    this.mode = 'progression'; // 'progression' | 'fixed'
    
    // 等級系統
    this.level = 1;
    this.maxLevel = 3;
    this.maxLevelReached = 1;
    this.levelScoreThresholds = {
      1: 100,  // Level 1→2 需要 100 分
      2: 250   // Level 2→3 需要 250 分
    };
    this.levelTimeLimits = {
      1: 7,   // Level 1: 7 秒
      2: 5,    // Level 2: 5 秒
      3: 3     // Level 3: 3 秒
    };
  }

  /**
   * 開始遊戲
   * @param {Object} options - 遊戲選項
   */
  startGame(options = {}) {
    this.reset();
    
    // 設定遊戲選項
    this.totalQuestions = options.totalQuestions || 10;
    this.minTable = options.minTable || 1;
    this.maxTable = options.maxTable || 9;
    
    // 設定遊戲模式
    this.mode = options.mode || 'progression';
    
    // 如果是固定難度模式，設定等級
    if (this.mode === 'fixed' && options.gameLevel) {
      this.level = options.gameLevel;
      this.maxLevelReached = options.gameLevel;
    }
    
    this.isGameActive = true;
    this.startTime = Date.now();
    
    // 載入第一題
    this.loadNextQuestion();
  }

  /**
   * 載入下一題
   * @returns {Object|null} 題目物件，如果沒有更多題目則回傳 null
   */
  loadNextQuestion() {
    if (this.currentQuestionIndex >= this.totalQuestions) {
      return null;
    }

    // 根據等級決定要排除的數字
    const excludeNumbers = this.getExcludeNumbers();
    
    this.currentQuestion = this.questionGenerator.generateQuestion(
      this.minTable,
      this.maxTable,
      excludeNumbers
    );
    this.currentQuestionIndex++;
    this.questionStartTime = Date.now();

    return this.currentQuestion;
  }

  /**
   * 取得當前等級應排除的數字
   * @returns {Array<number>} 要排除的數字陣列
   */
  getExcludeNumbers() {
    const excludeMap = {
      1: [],           // Level 1: 不排除任何數字
      2: [1, 2],       // Level 2: 排除 1-2
      3: [1, 2, 3, 4]  // Level 3: 排除 1-4
    };
    return excludeMap[this.level] || [];
  }

  /**
   * 提交答案
   * @param {number} userAnswer - 使用者的答案
   * @returns {Object} 結果物件 {isCorrect, score, feedback, streak}
   */
  submitAnswer(userAnswer) {
    if (!this.isGameActive || !this.currentQuestion) {
      return null;
    }

    const isCorrect = this.questionGenerator.validateAnswer(
      userAnswer,
      this.currentQuestion.answer
    );

    // 計算答題時間
    const timeSpent = (Date.now() - this.questionStartTime) / 1000; // 秒

    // 計算得分
    const points = this.calculateScore(isCorrect, timeSpent);

    // 更新統計
    if (isCorrect) {
      this.correctCount++;
      this.streak++;
      this.maxStreak = Math.max(this.maxStreak, this.streak);
    } else {
      this.wrongCount++;
      this.streak = 0;
    }

    this.score += points;

    // 生成回饋訊息
    const feedback = this.generateFeedback(isCorrect, points, this.streak);

    return {
      isCorrect,
      correctAnswer: this.currentQuestion.answer,
      score: points,
      totalScore: this.score,
      streak: this.streak,
      feedback,
      timeSpent: timeSpent.toFixed(1)
    };
  }

  /**
   * 計算分數
   * @param {boolean} isCorrect - 是否答對
   * @param {number} timeSpent - 答題時間（秒）
   * @returns {number} 獲得的分數
   */
  calculateScore(isCorrect, timeSpent) {
    if (!isCorrect) {
      return 0; // 答錯不得分
    }

    const basePoints = 10; // 基礎分數
    let score = basePoints;

    // 速度加成
    let speedMultiplier = 1.0;
    if (timeSpent < 3) {
      speedMultiplier = 2.0; // 3秒內答對 ×2
    } else if (timeSpent < 5) {
      speedMultiplier = 1.5; // 5秒內答對 ×1.5
    }

    score *= speedMultiplier;

    // 連擊加成
    let streakMultiplier = 1.0;
    if (this.streak >= 10) {
      streakMultiplier = 3.0;
    } else if (this.streak >= 5) {
      streakMultiplier = 2.0;
    } else if (this.streak >= 3) {
      streakMultiplier = 1.5;
    }

    score *= streakMultiplier;

    // 難度加成
    const difficulty = this.questionGenerator.getDifficulty(
      this.currentQuestion.multiplicand,
      this.currentQuestion.multiplier
    );
    const difficultyMultiplier = this.questionGenerator.getDifficultyMultiplier(difficulty);
    score *= difficultyMultiplier;

    return Math.round(score);
  }

  /**
   * 生成回饋訊息
   * @param {boolean} isCorrect - 是否答對
   * @param {number} points - 獲得的分數
   * @param {number} streak - 連擊數
   * @returns {string} 回饋訊息
   */
  generateFeedback(isCorrect, points, streak) {
    if (isCorrect) {
      const messages = [
        '太棒了！😊',
        '答對了！👍',
        '很厲害！⭐',
        '做得好！🎉',
        '完美！✨',
        '繼續加油！💪',
        '超級棒！🌟'
      ];

      let feedback = messages[Math.floor(Math.random() * messages.length)];

      // 連擊獎勵訊息
      if (streak >= 10) {
        feedback = '🔥 驚人的 10 連擊！你是乘法大師！';
      } else if (streak >= 5) {
        feedback = '⚡ 太強了！5 連擊！';
      } else if (streak >= 3) {
        feedback = '✨ 很棒！3 連擊！';
      }

      return feedback;
    } else {
      const messages = [
        '沒關係，再試一次！😊',
        '加油！你可以的！💪',
        '別灰心，繼續努力！🌟',
        '下一題會更好！✨'
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }

  /**
   * 取得當前題目
   * @returns {Object} 當前題目
   */
  getCurrentQuestion() {
    return this.currentQuestion;
  }

  /**
   * 取得當前等級時間限制
   * @returns {number} 時間限制（秒）
   */
  getCurrentTimeLimit() {
    return this.levelTimeLimits[this.level];
  }

  /**
   * 檢查是否可以進級
   * @returns {Object} 進級結果 {leveledUp, newLevel, timeLimit}
   */
  checkLevelUp() {
    // 只有晉級模式才可以升級
    if (this.mode !== 'progression') {
      return { leveledUp: false };
    }
    
    if (this.level < this.maxLevel) {
      const threshold = this.levelScoreThresholds[this.level];
      if (this.score >= threshold) {
        this.level++;
        this.maxLevelReached = Math.max(this.maxLevelReached, this.level);
        return {
          leveledUp: true,
          newLevel: this.level,
          timeLimit: this.levelTimeLimits[this.level]
        };
      }
    }
    return { leveledUp: false };
  }

  /**
   * 取得遊戲進度
   * @returns {Object} 進度資訊
   */
  getProgress() {
    return {
      current: this.currentQuestionIndex,
      total: this.totalQuestions,
      percentage: (this.currentQuestionIndex / this.totalQuestions) * 100
    };
  }

  /**
   * 取得遊戲統計
   * @returns {Object} 統計資訊
   */
  getStats() {
    const totalTime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
    const accuracy = this.currentQuestionIndex > 0
      ? (this.correctCount / this.currentQuestionIndex) * 100
      : 0;

    return {
      score: this.score,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      totalAnswered: this.currentQuestionIndex,
      streak: this.streak,
      maxStreak: this.maxStreak,
      accuracy: accuracy.toFixed(1),
      totalTime: totalTime.toFixed(1),
      level: this.level,
      maxLevelReached: this.maxLevelReached,
      timeLimit: this.getCurrentTimeLimit()
    };
  }

  /**
   * 判斷遊戲是否結束
   * @returns {boolean} 是否結束
   */
  isGameOver() {
    return this.currentQuestionIndex >= this.totalQuestions;
  }

  /**
   * 結束遊戲
   * @returns {Object} 最終結果
   */
  endGame() {
    this.isGameActive = false;
    const stats = this.getStats();

    // 生成結果訊息
    let resultMessage = '';
    const accuracy = parseFloat(stats.accuracy);

    if (accuracy === 100) {
      resultMessage = '🏆 完美！全部答對！你是乘法表大師！';
    } else if (accuracy >= 90) {
      resultMessage = '🌟 太棒了！正確率超高！';
    } else if (accuracy >= 70) {
      resultMessage = '👍 做得不錯！繼續加油！';
    } else if (accuracy >= 50) {
      resultMessage = '💪 還不錯！多練習會更好！';
    } else {
      resultMessage = '😊 別灰心！多練習就會進步！';
    }

    // 添加連擊獎勵訊息
    if (stats.maxStreak >= 10) {
      resultMessage += ` 最高連擊 ${stats.maxStreak} 次！`;
    }

    return {
      ...stats,
      resultMessage
    };
  }

  /**
   * 取得情緒圖示（根據表現）
   * @returns {string} 情緒圖示
   */
  getMoodIcon() {
    const accuracy = this.currentQuestionIndex > 0
      ? (this.correctCount / this.currentQuestionIndex) * 100
      : 100;

    if (accuracy >= 90) return '😄';
    if (accuracy >= 70) return '😊';
    if (accuracy >= 50) return '🙂';
    return '😅';
  }
}

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameEngine;
}
