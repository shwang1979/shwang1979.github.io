/**
 * 應用程式主入口
 * 初始化所有組件並綁定事件
 */

// 全域變數
let componentLibrary;
let buildEngine;
let buildEngineChallenge;
let dragController;
let dragControllerChallenge;
let challengeManager;
let uiController;

/**
 * 初始化應用程式
 */
function init() {
  console.log('🏠 創意蓋房子遊戲啟動中...');
  
  // 創建元件庫
  componentLibrary = new ComponentLibrary();
  console.log(`✓ 元件庫已載入 (${componentLibrary.getTotalCount()} 個元件)`);
  
  // 創建建造引擎（自由模式）
  buildEngine = new BuildEngine('build-canvas', 20);
  console.log('✓ 自由建造引擎已初始化');
  
  // 創建建造引擎（挑戰模式）
  buildEngineChallenge = new BuildEngine('build-canvas-challenge', 20);
  console.log('✓ 挑戰建造引擎已初始化');
  
  // 創建拖放控制器（自由模式）
  dragController = new DragController(buildEngine, componentLibrary);
  dragController.enableDelete();
  dragController.setOnComponentPlaced(() => {
    uiController.updateStats();
  });
  dragController.setOnComponentRemoved(() => {
    uiController.updateStats();
  });
  console.log('✓ 自由模式拖放控制器已初始化');
  
  // 創建拖放控制器（挑戰模式）
  dragControllerChallenge = new DragController(buildEngineChallenge, componentLibrary);
  dragControllerChallenge.enableDelete();
  dragControllerChallenge.setOnComponentPlaced(() => {
    const result = uiController.updateChallengeProgress();
    if (result && result.completed) {
      uiController.showChallengeComplete();
    }
  });
  dragControllerChallenge.setOnComponentRemoved(() => {
    uiController.updateChallengeProgress();
  });
  console.log('✓ 挑戰模式拖放控制器已初始化');
  
  // 創建挑戰管理器
  challengeManager = new ChallengeManager(buildEngineChallenge);
  console.log(`✓ 挑戰管理器已初始化 (${challengeManager.getTotalChallenges()} 個關卡)`);
  
  // 創建 UI 控制器
  uiController = new UIController();
  uiController.setDependencies(componentLibrary, buildEngine, dragController, challengeManager, buildEngineChallenge, dragControllerChallenge);
  console.log('✓ UI 控制器已初始化');
  
  // 綁定事件
  bindEvents();
  console.log('✓ 事件已綁定');
  
  // 顯示開始畫面
  uiController.showScreen('start');
  
  console.log('🎉 應用程式已準備就緒！');
}

/**
 * 綁定所有事件監聽器
 */
function bindEvents() {
  // === 開始畫面 ===
  
  // 模式選擇卡片
  const modeCards = document.querySelectorAll('.mode-card');
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
  
  // 開始按鈕
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const activeMode = document.querySelector('.mode-card.active');
      const mode = activeMode ? activeMode.getAttribute('data-mode') : 'free';
      
      if (mode === 'free') {
        uiController.startFreeBuild();
      } else if (mode === 'challenge') {
        uiController.startChallenge(1);
      }
    });
  }
  
  // === 自由建造模式 ===
  
  // 返回選單按鈕
  const backToMenuBtn = document.getElementById('back-to-menu-btn');
  if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
      if (confirm('確定要返回選單嗎？當前進度將不會保存。')) {
        uiController.showScreen('start');
      }
    });
  }
  
  // 網格切換按鈕
  const gridToggleBtn = document.getElementById('grid-toggle-btn');
  if (gridToggleBtn) {
    gridToggleBtn.addEventListener('click', () => {
      uiController.toggleGrid(false);
    });
  }
  
  // 清空按鈕
  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (uiController.confirmClear()) {
        buildEngine.clear();
        uiController.updateStats();
      }
    });
  }
  
  // === 挑戰模式 ===
  
  // 返回選單按鈕（挑戰）
  const backToMenuChallengeBtn = document.getElementById('back-to-menu-challenge-btn');
  if (backToMenuChallengeBtn) {
    backToMenuChallengeBtn.addEventListener('click', () => {
      if (confirm('確定要返回選單嗎？當前挑戰進度將不會保存。')) {
        uiController.showScreen('start');
        challengeManager.reset();
      }
    });
  }
  
  // 網格切換按鈕（挑戰）
  const gridToggleChallengeBtn = document.getElementById('grid-toggle-challenge-btn');
  if (gridToggleChallengeBtn) {
    gridToggleChallengeBtn.addEventListener('click', () => {
      uiController.toggleGrid(true);
    });
  }
  
  // 清空按鈕（挑戰）
  const clearChallengeBtn = document.getElementById('clear-challenge-btn');
  if (clearChallengeBtn) {
    clearChallengeBtn.addEventListener('click', () => {
      if (confirm('確定要清空畫布嗎？')) {
        buildEngineChallenge.clear();
        uiController.updateChallengeProgress();
      }
    });
  }
  
  // 檢查完成按鈕
  const checkChallengeBtn = document.getElementById('check-challenge-btn');
  if (checkChallengeBtn) {
    checkChallengeBtn.addEventListener('click', () => {
      const result = challengeManager.checkCompletion();
      
      if (result.completed) {
        uiController.showChallengeComplete();
      } else {
        const incomplete = result.progress.filter(p => !p.completed);
        let message = '還有以下要求未完成：\n\n';
        incomplete.forEach(item => {
          message += `${item.requirement.label}: ${item.current}/${item.target}\n`;
        });
        alert(message);
      }
    });
  }
  
  // === 鍵盤快捷鍵 ===
  
  document.addEventListener('keydown', (e) => {
    // Delete 鍵刪除選中的元件
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (buildEngine.selectedComponent) {
        e.preventDefault();
        if (confirm('確定要刪除選中的元件嗎？')) {
          buildEngine.removeComponent(buildEngine.selectedComponent.id);
          if (uiController.currentMode === 'free') {
            uiController.updateStats();
          } else if (uiController.currentMode === 'challenge') {
            uiController.updateChallengeProgress();
          }
        }
      }
    }
    
    // Escape 鍵取消選擇
    if (e.key === 'Escape') {
      buildEngine.deselectComponent();
      buildEngineChallenge.deselectComponent();
    }
    
    // G 鍵切換網格
    if (e.key === 'g' || e.key === 'G') {
      if (uiController.currentMode === 'free') {
        uiController.toggleGrid(false);
      } else if (uiController.currentMode === 'challenge') {
        uiController.toggleGrid(true);
      }
    }
  });
}

/**
 * 頁面載入完成後初始化
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
