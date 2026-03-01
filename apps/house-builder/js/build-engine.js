/**
 * 建造引擎 - 管理建造狀態和邏輯
 */

class BuildEngine {
  constructor(canvasId, gridSize = 20) {
    this.canvas = document.getElementById(canvasId);
    this.gridSize = gridSize;
    this.gridEnabled = true;
    
    // 圖層引用
    this.layers = {
      ground: document.getElementById(`${canvasId.replace('build-canvas', 'ground-layer')}`),
      walls: document.getElementById(`${canvasId.replace('build-canvas', 'walls-layer')}`),
      roof: document.getElementById(`${canvasId.replace('build-canvas', 'roof-layer')}`),
      doors: document.getElementById(`${canvasId.replace('build-canvas', 'doors-layer')}`),
      windows: document.getElementById(`${canvasId.replace('build-canvas', 'windows-layer')}`),
      decorations: document.getElementById(`${canvasId.replace('build-canvas', 'decorations-layer')}`),
      preview: document.getElementById(`${canvasId.replace('build-canvas', 'preview-layer')}`)
    };
    
    // 狀態
    this.placedComponents = [];
    this.selectedComponent = null;
    this.nextId = 1;
  }

  /**
   * 獲取適當的圖層
   */
  getLayerForComponent(component) {
    const layerMap = {
      'foundations': this.layers.ground,
      'walls': this.layers.walls,
      'roofs': this.layers.roof,
      'doors': this.layers.doors,
      'windows': this.layers.windows,
      'decorations': this.layers.decorations
    };
    return layerMap[component.category] || this.layers.decorations;
  }

  /**
   * 網格吸附
   */
  snapToGrid(x, y) {
    if (!this.gridEnabled) {
      return { x, y };
    }
    return {
      x: Math.round(x / this.gridSize) * this.gridSize,
      y: Math.round(y / this.gridSize) * this.gridSize
    };
  }

  /**
   * 放置元件
   */
  placeComponent(component, x, y) {
    // 網格吸附
    const snapped = this.snapToGrid(x, y);
    
    // 創建放置的元件實例
    const placed = {
      id: `placed-${this.nextId++}`,
      componentId: component.id,
      component: component,
      x: snapped.x,
      y: snapped.y,
      width: component.width,
      height: component.height,
      layer: component.layer
    };
    
    // 創建 SVG 元素
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', placed.id);
    g.setAttribute('class', 'placed-component');
    g.setAttribute('transform', `translate(${snapped.x}, ${snapped.y})`);
    g.setAttribute('data-component-id', component.id);
    g.innerHTML = component.svg;
    
    // 添加到適當的圖層
    const targetLayer = this.getLayerForComponent(component);
    targetLayer.appendChild(g);
    
    // 保存到狀態
    placed.element = g;
    this.placedComponents.push(placed);
    
    return placed;
  }

  /**
   * 移除元件
   */
  removeComponent(placedId) {
    const index = this.placedComponents.findIndex(p => p.id === placedId);
    if (index !== -1) {
      const placed = this.placedComponents[index];
      placed.element.remove();
      this.placedComponents.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 移動元件
   */
  moveComponent(placedId, x, y) {
    const placed = this.placedComponents.find(p => p.id === placedId);
    if (placed) {
      const snapped = this.snapToGrid(x, y);
      placed.x = snapped.x;
      placed.y = snapped.y;
      placed.element.setAttribute('transform', `translate(${snapped.x}, ${snapped.y})`);
      return true;
    }
    return false;
  }

  /**
   * 選擇元件
   */
  selectComponent(placedId) {
    // 取消之前的選擇
    if (this.selectedComponent) {
      this.selectedComponent.element.classList.remove('selected');
    }
    
    // 選擇新元件
    const placed = this.placedComponents.find(p => p.id === placedId);
    if (placed) {
      placed.element.classList.add('selected');
      this.selectedComponent = placed;
      return true;
    }
    return false;
  }

  /**
   * 取消選擇
   */
  deselectComponent() {
    if (this.selectedComponent) {
      this.selectedComponent.element.classList.remove('selected');
      this.selectedComponent = null;
    }
  }

  /**
   * 清空畫布
   */
  clear() {
    this.placedComponents.forEach(placed => {
      placed.element.remove();
    });
    this.placedComponents = [];
    this.selectedComponent = null;
    this.nextId = 1;
  }

  /**
   * 切換網格吸附
   */
  toggleGrid() {
    this.gridEnabled = !this.gridEnabled;
    return this.gridEnabled;
  }

  /**
   * 獲取已放置元件數量
   */
  getPlacedCount() {
    return this.placedComponents.length;
  }

  /**
   * 根據類別統計元件
   */
  getComponentCountByCategory(category) {
    return this.placedComponents.filter(p => p.component.category === category).length;
  }

  /**
   * 根據元件 ID 統計
   */
  getComponentCountById(componentId) {
    return this.placedComponents.filter(p => p.componentId === componentId).length;
  }

  /**
   * 檢查是否有特定類型的元件
   */
  hasComponentType(category) {
    return this.placedComponents.some(p => p.component.category === category);
  }

  /**
   * 獲取所有已放置元件的資料
   */
  getPlacedComponentsData() {
    return this.placedComponents.map(p => ({
      id: p.id,
      componentId: p.componentId,
      category: p.component.category,
      x: p.x,
      y: p.y
    }));
  }

  /**
   * 根據位置查找元件
   */
  findComponentAt(x, y) {
    // 從上到下（最後放置的優先）
    for (let i = this.placedComponents.length - 1; i >= 0; i--) {
      const placed = this.placedComponents[i];
      if (x >= placed.x && x <= placed.x + placed.width &&
          y >= placed.y && y <= placed.y + placed.height) {
        return placed;
      }
    }
    return null;
  }

  /**
   * 顯示拖放預覽
   */
  showPreview(component, x, y) {
    const snapped = this.snapToGrid(x, y);
    
    // 清除舊預覽
    this.layers.preview.innerHTML = '';
    
    // 創建新預覽
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'drag-preview');
    g.setAttribute('transform', `translate(${snapped.x}, ${snapped.y})`);
    g.innerHTML = component.svg;
    
    this.layers.preview.appendChild(g);
  }

  /**
   * 隱藏預覽
   */
  hidePreview() {
    this.layers.preview.innerHTML = '';
  }

  /**
   * 更新預覽位置
   */
  updatePreview(x, y) {
    const preview = this.layers.preview.firstElementChild;
    if (preview) {
      const snapped = this.snapToGrid(x, y);
      preview.setAttribute('transform', `translate(${snapped.x}, ${snapped.y})`);
    }
  }
}
