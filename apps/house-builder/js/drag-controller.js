/**
 * 拖放控制器 - 處理拖放操作
 */

class DragController {
  constructor(buildEngine, componentLibrary) {
    this.buildEngine = buildEngine;
    this.componentLibrary = componentLibrary;
    
    // 拖放狀態
    this.isDragging = false;
    this.draggedComponent = null;
    this.draggedElement = null;
    this.dragMode = null; // 'new' | 'move'
    this.dragOffset = { x: 0, y: 0 };
    
    // SVG 座標轉換
    this.svgPoint = null;
    if (buildEngine.canvas) {
      this.svgPoint = buildEngine.canvas.createSVGPoint();
    }
  }

  /**
   * 初始化元件項目的拖放
   */
  initComponentItem(element, component) {
    // 滑鼠事件
    element.addEventListener('mousedown', (e) => this.startDragNew(e, component, element));
    
    // 觸控事件
    element.addEventListener('touchstart', (e) => this.startDragNew(e, component, element), { passive: false });
  }

  /**
   * 初始化畫布上已放置元件的拖放
   */
  initPlacedComponent(placed) {
    const element = placed.element;
    
    // 滑鼠事件
    element.addEventListener('mousedown', (e) => this.startDragMove(e, placed));
    
    // 觸控事件
    element.addEventListener('touchstart', (e) => this.startDragMove(e, placed), { passive: false });
  }

  /**
   * 開始拖曳新元件（從面板）
   */
  startDragNew(e, component, sourceElement) {
    e.preventDefault();
    e.stopPropagation();
    
    this.isDragging = true;
    this.dragMode = 'new';
    this.draggedComponent = component;
    this.draggedElement = sourceElement;
    
    // 添加視覺反饋
    sourceElement.classList.add('dragging');
    
    // 顯示預覽
    const coords = this.getSVGCoordinates(e);
    if (coords) {
      this.buildEngine.showPreview(component, coords.x - component.width / 2, coords.y - component.height / 2);
    }
    
    // 綁定移動和結束事件
    this.bindDragEvents();
  }

  /**
   * 開始拖曳已放置的元件
   */
  startDragMove(e, placed) {
    e.preventDefault();
    e.stopPropagation();
    
    this.isDragging = true;
    this.dragMode = 'move';
    this.draggedComponent = placed.component;
    this.draggedElement = placed.element;
    this.draggedPlaced = placed;
    
    // 計算拖曳偏移
    const coords = this.getSVGCoordinates(e);
    if (coords) {
      this.dragOffset = {
        x: coords.x - placed.x,
        y: coords.y - placed.y
      };
    }
    
    // 選擇此元件
    this.buildEngine.selectComponent(placed.id);
    
    // 添加視覺反饋
    placed.element.style.opacity = '0.5';
    placed.element.style.cursor = 'grabbing';
    
    // 綁定移動和結束事件
    this.bindDragEvents();
  }

  /**
   * 綁定拖曳事件
   */
  bindDragEvents() {
    // 滑鼠事件
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);
    
    // 觸控事件
    document.addEventListener('touchmove', this.onDragMove, { passive: false });
    document.addEventListener('touchend', this.onDragEnd);
    document.addEventListener('touchcancel', this.onDragEnd);
  }

  /**
   * 解除綁定拖曳事件
   */
  unbindDragEvents() {
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchmove', this.onDragMove);
    document.removeEventListener('touchend', this.onDragEnd);
    document.removeEventListener('touchcancel', this.onDragEnd);
  }

  /**
   * 拖曳移動處理（箭頭函數保持 this 綁定）
   */
  onDragMove = (e) => {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    const coords = this.getSVGCoordinates(e);
    if (!coords) return;
    
    if (this.dragMode === 'new') {
      // 更新預覽位置
      this.buildEngine.updatePreview(
        coords.x - this.draggedComponent.width / 2,
        coords.y - this.draggedComponent.height / 2
      );
    } else if (this.dragMode === 'move') {
      // 移動已放置的元件
      this.buildEngine.moveComponent(
        this.draggedPlaced.id,
        coords.x - this.dragOffset.x,
        coords.y - this.dragOffset.y
      );
    }
  }

  /**
   * 拖曳結束處理（箭頭函數保持 this 綁定）
   */
  onDragEnd = (e) => {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    const coords = this.getSVGCoordinates(e);
    
    if (this.dragMode === 'new') {
      // 放置新元件
      if (coords && this.isValidDropZone(coords)) {
        const placed = this.buildEngine.placeComponent(
          this.draggedComponent,
          coords.x - this.draggedComponent.width / 2,
          coords.y - this.draggedComponent.height / 2
        );
        
        // 為新放置的元件初始化拖放
        this.initPlacedComponent(placed);
        
        // 播放放置動畫
        placed.element.classList.add('animate-drop-success');
        setTimeout(() => {
          placed.element.classList.remove('animate-drop-success');
        }, 400);
        
        // 觸發事件
        this.onComponentPlaced && this.onComponentPlaced(placed);
      }
      
      // 隱藏預覽
      this.buildEngine.hidePreview();
      
      // 移除視覺反饋
      if (this.draggedElement) {
        this.draggedElement.classList.remove('dragging');
      }
    } else if (this.dragMode === 'move') {
      // 完成移動
      if (this.draggedElement) {
        this.draggedElement.style.opacity = '';
        this.draggedElement.style.cursor = '';
      }
      
      // 觸發事件
      this.onComponentMoved && this.onComponentMoved(this.draggedPlaced);
    }
    
    // 重置狀態
    this.isDragging = false;
    this.dragMode = null;
    this.draggedComponent = null;
    this.draggedElement = null;
    this.draggedPlaced = null;
    this.dragOffset = { x: 0, y: 0 };
    
    // 解除事件綁定
    this.unbindDragEvents();
  }

  /**
   * 獲取 SVG 座標
   */
  getSVGCoordinates(e) {
    if (!this.buildEngine.canvas || !this.svgPoint) return null;
    
    // 獲取事件座標
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // 轉換為 SVG 座標
    this.svgPoint.x = clientX;
    this.svgPoint.y = clientY;
    
    try {
      const ctm = this.buildEngine.canvas.getScreenCTM();
      if (ctm) {
        const transformed = this.svgPoint.matrixTransform(ctm.inverse());
        return { x: transformed.x, y: transformed.y };
      }
    } catch (err) {
      console.error('座標轉換失敗:', err);
    }
    
    return null;
  }

  /**
   * 檢查是否為有效的放置區域
   */
  isValidDropZone(coords) {
    // 檢查是否在畫布內
    const viewBox = this.buildEngine.canvas.viewBox.baseVal;
    return coords.x >= 0 && coords.x <= viewBox.width &&
           coords.y >= 0 && coords.y <= viewBox.height;
  }

  /**
   * 初始化刪除功能（點擊已選擇的元件再次點擊刪除）
   */
  enableDelete() {
    this.buildEngine.canvas.addEventListener('dblclick', (e) => {
      const coords = this.getSVGCoordinates(e);
      if (coords) {
        const found = this.buildEngine.findComponentAt(coords.x, coords.y);
        if (found) {
          // 確認刪除
          if (confirm(`確定要刪除「${found.component.name}」嗎？`)) {
            this.buildEngine.removeComponent(found.id);
            
            // 觸發事件
            this.onComponentRemoved && this.onComponentRemoved(found);
          }
        }
      }
    });
  }

  /**
   * 設置元件放置回調
   */
  setOnComponentPlaced(callback) {
    this.onComponentPlaced = callback;
  }

  /**
   * 設置元件移動回調
   */
  setOnComponentMoved(callback) {
    this.onComponentMoved = callback;
  }

  /**
   * 設置元件移除回調
   */
  setOnComponentRemoved(callback) {
    this.onComponentRemoved = callback;
  }
}
