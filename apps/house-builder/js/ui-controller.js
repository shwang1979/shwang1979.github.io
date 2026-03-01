/**
 * UI 控制器 - 管理 UI 更新和交互
 */

class UIController {
  constructor() {
    // 屏幕元素
    this.screens = {
      start: document.getElementById('start-screen'),
      build: document.getElementById('build-screen'),
      challenge: document.getElementById('challenge-screen')
    };
    
    // 當前模式
    this.currentMode = null;
    
    // 存儲引用
    this.componentLibrary = null;
    this.buildEngine = null;
    this.dragController = null;
    this.challengeManager = null;
  }

  /**
   * 設置依賴
   */
  setDependencies(componentLibrary, buildEngine, dragController, challengeManager, buildEngineChallenge, dragControllerChallenge) {
    this.componentLibrary = componentLibrary;
    this.buildEngine = buildEngine;
    this.buildEngineChallenge = buildEngineChallenge;
    this.dragController = dragController;
    this.dragControllerChallenge = dragControllerChallenge;
    this.challengeManager = challengeManager;
  }

  /**
   * 顯示屏幕
   */
  showScreen(screenName) {
    Object.keys(this.screens).forEach(name => {
      if (this.screens[name]) {
        this.screens[name].classList.remove('active');
      }
    });
    
    if (this.screens[screenName]) {
      this.screens[screenName].classList.add('active');
      this.screens[screenName].classList.add('animate-fade-in');
      
      setTimeout(() => {
        this.screens[screenName].classList.remove('animate-fade-in');
      }, 300);
    }
  }

  /**
   * 渲染元件面板
   */
  renderComponentPanel(listElementId, category = 'all', useChallengeMode = false) {
    const listElement = document.getElementById(listElementId);
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    const components = this.componentLibrary.getComponentsByCategory(category);
    const dragCtrl = useChallengeMode ? this.dragControllerChallenge : this.dragController;
    
    components.forEach(component => {
      const item = document.createElement('div');
      item.className = 'component-item';
      item.setAttribute('data-component-id', component.id);
      
      // 創建 SVG 預覽
      const preview = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      preview.setAttribute('class', 'component-preview');
      preview.setAttribute('viewBox', `0 0 ${component.width} ${component.height}`);
      preview.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      preview.innerHTML = component.svg;
      
      // 創建名稱
      const name = document.createElement('div');
      name.className = 'component-name';
      name.textContent = component.name;
      
      item.appendChild(preview);
      item.appendChild(name);
      listElement.appendChild(item);
      
      // 初始化拖放
      dragCtrl.initComponentItem(item, component);
    });
  }

  /**
   * 設置分類標籤事件
   */
  setupCategoryTabs(containerSelector, listElementId, useChallengeMode = false) {
    const tabs = document.querySelectorAll(`${containerSelector} .category-tab`);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // 更新活動標籤
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 渲染對應類別
        const category = tab.getAttribute('data-category');
        this.renderComponentPanel(listElementId, category, useChallengeMode);
      });
    });
  }

  /**
   * 更新統計資訊
   */
  updateStats() {
    // 更新自由建造模式的統計
    const placedCount = document.getElementById('placed-count');
    const totalComponents = document.getElementById('total-components');
    
    if (placedCount) {
      placedCount.textContent = this.buildEngine.getPlacedCount();
    }
    
    if (totalComponents) {
      totalComponents.textContent = this.componentLibrary.getTotalCount();
    }
  }

  /**
   * 更新挑戰進度
   */
  updateChallengeProgress() {
    if (this.currentMode !== 'challenge') return;
    
    const result = this.challengeManager.checkCompletion();
    
    // 更新進度文字
    const progressText = document.getElementById('challenge-progress-text');
    if (progressText) {
      progressText.textContent = this.challengeManager.getProgressText();
    }
    
    // 更新要求列表
    const requirementsContainer = document.getElementById('requirements-container');
    if (requirementsContainer) {
      requirementsContainer.innerHTML = '';
      
      result.progress.forEach(item => {
        const reqElement = document.createElement('div');
        reqElement.className = `requirement-item ${item.completed ? 'completed' : ''}`;
        
        const icon = document.createElement('span');
        icon.className = 'requirement-icon';
        icon.textContent = item.completed ? '✓' : '○';
        
        const text = document.createElement('span');
        text.className = 'requirement-text';
        text.textContent = `${item.requirement.label} (${item.current}/${item.target})`;
        
        reqElement.appendChild(icon);
        reqElement.appendChild(text);
        requirementsContainer.appendChild(reqElement);
      });
    }
    
    return result;
  }

  /**
   * 顯示挑戰完成動畫
   */
  showChallengeComplete() {
    // 播放慶祝動畫
    const canvas = document.getElementById('effects-canvas-challenge');
    if (canvas) {
      this.playCelebrationEffect(canvas);
    }
    
    // 顯示完成訊息
    const nextLevel = this.challengeManager.getNextLevel();
    let message = '🎉 挑戰完成！恭喜你！';
    
    if (nextLevel) {
      message += `\n\n準備好挑戰 Level ${nextLevel} 了嗎？`;
      
      setTimeout(() => {
        if (confirm(message)) {
          // 開始下一關
          this.startChallenge(nextLevel);
        }
      }, 1000);
    } else {
      message += '\n\n你已經完成所有挑戰！真厲害！';
      setTimeout(() => {
        alert(message);
      }, 1000);
    }
  }

  /**
   * 播放慶祝特效
   */
  playCelebrationEffect(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // 創建紙花
    const confetti = [];
    const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
    
    for (let i = 0; i < 100; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4
      });
    }
    
    // 動畫循環
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let allGone = true;
      
      confetti.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.rotationSpeed;
        c.vy += 0.1; // 重力
        
        if (c.y < canvas.height + 20) {
          allGone = false;
          
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.rotation * Math.PI / 180);
          ctx.fillStyle = c.color;
          ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
          ctx.restore();
        }
      });
      
      if (!allGone) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  /**
   * 開始自由建造模式
   */
  startFreeBuild() {
    this.currentMode = 'free';
    this.showScreen('build');
    
    // 清空之前的狀態
    this.buildEngine.clear();
    
    // 渲染元件面板
    this.renderComponentPanel('component-list');
    
    // 設置分類標籤
    this.setupCategoryTabs('#build-screen', 'component-list');
    
    // 更新統計
    this.updateStats();
  }

  /**
   * 開始挑戰模式
   */
  startChallenge(level = 1) {
    this.currentMode = 'challenge';
    this.showScreen('challenge');
    
    // 清空之前的狀態
    this.buildEngineChallenge.clear();
    
    // 開始挑戰
    const challenge = this.challengeManager.startChallenge(level);
    
    // 更新挑戰資訊
    const levelElement = document.getElementById('challenge-level');
    const descElement = document.getElementById('challenge-description');
    
    if (levelElement) {
      levelElement.textContent = `關卡 ${level}`;
    }
    
    if (descElement) {
      descElement.textContent = challenge.description;
    }
    
    // 渲染元件面板
    this.renderComponentPanel('component-list-challenge', 'all', true);
    
    // 設置分類標籤
    this.setupCategoryTabs('#challenge-screen', 'component-list-challenge', true);
    
    // 更新進度
    this.updateChallengeProgress();
  }

  /**
   * 切換網格顯示
   */
  toggleGrid(isChallenge = false) {
    const engine = isChallenge ? this.buildEngineChallenge : this.buildEngine;
    const gridOverlay = document.getElementById(isChallenge ? 'grid-overlay-challenge' : 'grid-overlay');
    const button = document.getElementById(isChallenge ? 'grid-toggle-challenge-btn' : 'grid-toggle-btn');
    
    const enabled = engine.toggleGrid();
    
    if (gridOverlay) {
      if (enabled) {
        gridOverlay.classList.add('grid-visible');
        gridOverlay.classList.remove('grid-hidden');
      } else {
        gridOverlay.classList.add('grid-hidden');
        gridOverlay.classList.remove('grid-visible');
      }
    }
    
    if (button) {
      if (enabled) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  }

  /**
   * 清空畫布確認
   */
  confirmClear() {
    if (this.buildEngine.getPlacedCount() === 0) {
      return true;
    }
    
    return confirm('確定要清空畫布嗎？所有元件將被移除。');
  }
}
