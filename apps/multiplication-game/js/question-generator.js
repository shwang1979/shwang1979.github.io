/**
 * 題目生成器
 * 負責生成九九乘法表的題目
 */

class QuestionGenerator {
  constructor() {
    this.usedQuestions = new Set(); // 追蹤已使用的題目
  }

  /**
   * 生成一個新的乘法題目
   * @param {number} minTable - 最小乘法表 (預設 1)
   * @param {number} maxTable - 最大乘法表 (預設 9)
   * @param {Array<number>} excludeNumbers - 要排除的數字陣列 (預設 [])
   * @returns {Object} 題目物件 {multiplicand, multiplier, answer}
   */
  generateQuestion(minTable = 1, maxTable = 9, excludeNumbers = []) {
    let multiplicand, multiplier, answer;
    let questionKey;
    let attempts = 0;
    const maxAttempts = 100;

    // 嘗試生成一個尚未使用的題目
    do {
      multiplicand = this.getRandomNumber(minTable, maxTable, excludeNumbers);
      multiplier = this.getRandomNumber(minTable, maxTable, excludeNumbers);
      answer = multiplicand * multiplier;
      questionKey = `${multiplicand}x${multiplier}`;
      attempts++;

      // 如果嘗試太多次，清空已使用的題目記錄
      if (attempts > maxAttempts) {
        this.usedQuestions.clear();
        break;
      }
    } while (this.usedQuestions.has(questionKey));

    // 記錄這個題目
    this.usedQuestions.add(questionKey);

    return {
      multiplicand,
      multiplier,
      answer,
      questionKey
    };
  }

  /**
   * 生成特定乘法表的題目
   * @param {number} table - 指定的乘法表 (例如 7 代表 7 的乘法表)
   * @returns {Object} 題目物件
   */
  generateTableQuestion(table) {
    const multiplier = this.getRandomNumber(1, 9);
    const answer = table * multiplier;
    
    return {
      multiplicand: table,
      multiplier,
      answer,
      questionKey: `${table}x${multiplier}`
    };
  }

  /**
   * 生成一組題目
   * @param {number} count - 題目數量
   * @param {number} minTable - 最小乘法表
   * @param {number} maxTable - 最大乘法表
   * @returns {Array} 題目陣列
   */
  generateQuestions(count, minTable = 1, maxTable = 9) {
    const questions = [];
    this.reset(); // 重置已使用的題目

    for (let i = 0; i < count; i++) {
      questions.push(this.generateQuestion(minTable, maxTable));
    }

    return questions;
  }

  /**
   * 獲取隨機數字
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {Array<number>} excludeNumbers - 要排除的數字陣列 (預設 [])
   * @returns {number} 隨機數字
   */
  getRandomNumber(min, max, excludeNumbers = []) {
    // 生成可用數字範圍
    const availableNumbers = [];
    for (let i = min; i <= max; i++) {
      if (!excludeNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }
    
    // 如果沒有可用數字，返回 min
    if (availableNumbers.length === 0) {
      return min;
    }
    
    // 從可用數字中隨機選擇
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  }

  /**
   * 重置題目記錄
   */
  reset() {
    this.usedQuestions.clear();
  }

  /**
   * 獲取題目難度分級
   * @param {number} multiplicand - 被乘數
   * @param {number} multiplier - 乘數
   * @returns {string} 難度等級 ('easy', 'medium', 'hard')
   */
  getDifficulty(multiplicand, multiplier) {
    const max = Math.max(multiplicand, multiplier);
    
    if (max <= 3) return 'easy';
    if (max <= 6) return 'medium';
    return 'hard';
  }

  /**
   * 獲取難度乘數（用於計分）
   * @param {string} difficulty - 難度等級
   * @returns {number} 難度乘數
   */
  getDifficultyMultiplier(difficulty) {
    const multipliers = {
      'easy': 1.0,
      'medium': 1.5,
      'hard': 2.0
    };
    return multipliers[difficulty] || 1.0;
  }

  /**
   * 驗證答案
   * @param {number} userAnswer - 使用者的答案
   * @param {number} correctAnswer - 正確答案
   * @returns {boolean} 是否正確
   */
  validateAnswer(userAnswer, correctAnswer) {
    return parseInt(userAnswer) === parseInt(correctAnswer);
  }
}

// 導出供其他模組使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuestionGenerator;
}
