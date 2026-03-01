/**
 * 挑戰管理器 - 管理挑戰模式
 */

class ChallengeManager {
  constructor(buildEngine) {
    this.buildEngine = buildEngine;
    this.currentChallenge = null;
    this.currentLevel = 1;
    this.challenges = this.initializeChallenges();
  }

  /**
   * 初始化所有挑戰
   */
  initializeChallenges() {
    return [
      {
        level: 1,
        title: '基礎房屋',
        description: '建造一個有 1 面牆和 1 個屋頂的基本房子',
        requirements: [
          { type: 'category', category: 'walls', count: 1, label: '牆壁 x1' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' }
        ]
      },
      {
        level: 2,
        title: '完整房屋',
        description: '建造一個有牆、屋頂、門和窗戶的完整房子',
        requirements: [
          { type: 'category', category: 'walls', count: 1, label: '牆壁 x1' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' },
          { type: 'category', category: 'doors', count: 1, label: '門 x1' },
          { type: 'category', category: 'windows', count: 1, label: '窗戶 x1' }
        ]
      },
      {
        level: 3,
        title: '雙牆房屋',
        description: '建造一個有 2 面牆的房子',
        requirements: [
          { type: 'category', category: 'walls', count: 2, label: '牆壁 x2' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' }
        ]
      },
      {
        level: 4,
        title: '多窗房屋',
        description: '建造一個有至少 3 扇窗戶的房子',
        requirements: [
          { type: 'category', category: 'walls', count: 1, label: '牆壁 x1' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' },
          { type: 'category', category: 'windows', count: 3, label: '窗戶 x3' }
        ]
      },
      {
        level: 5,
        title: '花園別墅',
        description: '建造一個有花園裝飾的房子（至少 3 種裝飾）',
        requirements: [
          { type: 'category', category: 'walls', count: 1, label: '牆壁 x1' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' },
          { type: 'category', category: 'doors', count: 1, label: '門 x1' },
          { type: 'category', category: 'decorations', count: 3, label: '裝飾 x3' }
        ]
      },
      {
        level: 6,
        title: '雙層建築',
        description: '建造一個有 2 層的房子（2 面牆 + 2 個屋頂）',
        requirements: [
          { type: 'category', category: 'walls', count: 2, label: '牆壁 x2' },
          { type: 'category', category: 'roofs', count: 2, label: '屋頂 x2' }
        ]
      },
      {
        level: 7,
        title: '豪華住宅',
        description: '建造一個豪華房子（多個門窗）',
        requirements: [
          { type: 'category', category: 'walls', count: 2, label: '牆壁 x2' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' },
          { type: 'category', category: 'doors', count: 2, label: '門 x2' },
          { type: 'category', category: 'windows', count: 4, label: '窗戶 x4' }
        ]
      },
      {
        level: 8,
        title: '社區設施',
        description: '建造一個有多種設施的場景（至少 5 種裝飾）',
        requirements: [
          { type: 'category', category: 'walls', count: 1, label: '牆壁 x1' },
          { type: 'category', category: 'roofs', count: 1, label: '屋頂 x1' },
          { type: 'category', category: 'decorations', count: 5, label: '裝飾 x5' }
        ]
      },
      {
        level: 9,
        title: '完美莊園',
        description: '建造一個大型莊園（多牆多窗多裝飾）',
        requirements: [
          { type: 'category', category: 'walls', count: 3, label: '牆壁 x3' },
          { type: 'category', category: 'roofs', count: 2, label: '屋頂 x2' },
          { type: 'category', category: 'windows', count: 5, label: '窗戶 x5' },
          { type: 'category', category: 'decorations', count: 4, label: '裝飾 x4' }
        ]
      },
      {
        level: 10,
        title: '終極挑戰',
        description: '建造你的夢想城堡（至少 20 個元件）',
        requirements: [
          { type: 'total', count: 20, label: '總元件數 ≥20' },
          { type: 'category', category: 'walls', count: 3, label: '牆壁 x3' },
          { type: 'category', category: 'roofs', count: 2, label: '屋頂 x2' },
          { type: 'category', category: 'doors', count: 2, label: '門 x2' },
          { type: 'category', category: 'windows', count: 5, label: '窗戶 x5' }
        ]
      }
    ];
  }

  /**
   * 開始挑戰
   */
  startChallenge(level) {
    this.currentLevel = level;
    this.currentChallenge = this.challenges[level - 1];
    return this.currentChallenge;
  }

  /**
   * 獲取當前挑戰
   */
  getCurrentChallenge() {
    return this.currentChallenge;
  }

  /**
   * 檢查挑戰是否完成
   */
  checkCompletion() {
    if (!this.currentChallenge) return { completed: false, progress: [] };
    
    const progress = [];
    let allCompleted = true;
    
    this.currentChallenge.requirements.forEach(req => {
      let current = 0;
      let isCompleted = false;
      
      if (req.type === 'category') {
        current = this.buildEngine.getComponentCountByCategory(req.category);
        isCompleted = current >= req.count;
      } else if (req.type === 'total') {
        current = this.buildEngine.getPlacedCount();
        isCompleted = current >= req.count;
      }
      
      progress.push({
        requirement: req,
        current: current,
        target: req.count,
        completed: isCompleted
      });
      
      if (!isCompleted) {
        allCompleted = false;
      }
    });
    
    return {
      completed: allCompleted,
      progress: progress
    };
  }

  /**
   * 獲取進度文字
   */
  getProgressText() {
    const result = this.checkCompletion();
    const completed = result.progress.filter(p => p.completed).length;
    const total = result.progress.length;
    return `進度: ${completed}/${total}`;
  }

  /**
   * 獲取下一關卡
   */
  getNextLevel() {
    if (this.currentLevel < this.challenges.length) {
      return this.currentLevel + 1;
    }
    return null;
  }

  /**
   * 獲取挑戰總數
   */
  getTotalChallenges() {
    return this.challenges.length;
  }

  /**
   * 獲取所有挑戰列表
   */
  getAllChallenges() {
    return this.challenges;
  }

  /**
   * 重置當前挑戰
   */
  reset() {
    this.currentChallenge = null;
    this.currentLevel = 1;
  }
}
