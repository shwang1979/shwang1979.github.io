/**
 * 元件庫 - 定義所有可用的建造元件
 * 使用簡化的幾何形狀 + 顏色設計
 */

class ComponentLibrary {
  constructor() {
    this.components = this.initializeComponents();
  }

  /**
   * 初始化所有元件
   */
  initializeComponents() {
    return {
      foundations: this.createFoundations(),
      walls: this.createWalls(),
      roofs: this.createRoofs(),
      doors: this.createDoors(),
      windows: this.createWindows(),
      decorations: this.createDecorations()
    };
  }

  /**
   * 地基元件（4種）
   */
  createFoundations() {
    return [
      {
        id: 'ground-grass',
        name: '草地',
        category: 'foundations',
        width: 400,
        height: 80,
        layer: 0,
        svg: `<rect width="400" height="80" fill="#7EC850" stroke="#6AB040" stroke-width="2"/>
              <circle cx="50" cy="30" r="8" fill="#8ED860" opacity="0.6"/>
              <circle cx="120" cy="50" r="6" fill="#8ED860" opacity="0.6"/>
              <circle cx="200" cy="35" r="10" fill="#8ED860" opacity="0.6"/>
              <circle cx="280" cy="55" r="7" fill="#8ED860" opacity="0.6"/>
              <circle cx="350" cy="40" r="9" fill="#8ED860" opacity="0.6"/>`
      },
      {
        id: 'ground-desert',
        name: '沙漠地',
        category: 'foundations',
        width: 400,
        height: 80,
        layer: 0,
        svg: `<rect width="400" height="80" fill="#F4D03F" stroke="#E6B800" stroke-width="2"/>
              <circle cx="80" cy="40" r="5" fill="#E6B800" opacity="0.4"/>
              <circle cx="180" cy="55" r="4" fill="#E6B800" opacity="0.4"/>
              <circle cx="320" cy="45" r="6" fill="#E6B800" opacity="0.4"/>`
      },
      {
        id: 'ground-stone',
        name: '石板地',
        category: 'foundations',
        width: 400,
        height: 80,
        layer: 0,
        svg: `<rect width="400" height="80" fill="#95A5A6" stroke="#7F8C8D" stroke-width="2"/>
              <rect x="10" y="10" width="90" height="60" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1"/>
              <rect x="110" y="10" width="90" height="60" fill="#ADB5BD" stroke="#7F8C8D" stroke-width="1"/>
              <rect x="210" y="10" width="90" height="60" fill="#BDC3C7" stroke="#7F8C8D" stroke-width="1"/>
              <rect x="310" y="10" width="80" height="60" fill="#ADB5BD" stroke="#7F8C8D" stroke-width="1"/>`
      },
      {
        id: 'ground-dirt',
        name: '泥土地',
        category: 'foundations',
        width: 400,
        height: 80,
        layer: 0,
        svg: `<rect width="400" height="80" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <rect x="20" y="20" width="50" height="40" fill="#A0522D" opacity="0.5"/>
              <rect x="150" y="15" width="60" height="50" fill="#A0522D" opacity="0.5"/>
              <rect x="280" y="25" width="55" height="35" fill="#A0522D" opacity="0.5"/>`
      }
    ];
  }

  /**
   * 牆壁元件（8種）
   */
  createWalls() {
    return [
      {
        id: 'wall-brick-red',
        name: '紅磚牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#C0392B" stroke="#A93226" stroke-width="3"/>
              ${this.createBrickPattern(160, 180, '#E74C3C')}`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-brick-orange',
        name: '橘磚牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#E67E22" stroke="#D35400" stroke-width="3"/>
              ${this.createBrickPattern(160, 180, '#F39C12')}`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-wood-brown',
        name: '棕木牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#8B4513" stroke="#6B3410" stroke-width="3"/>
              ${this.createWoodPattern(160, 180)}`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-wood-light',
        name: '淺木牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#D2B48C" stroke="#A88860" stroke-width="3"/>
              ${this.createWoodPattern(160, 180, '#F5DEB3')}`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-stone-grey',
        name: '灰石牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="3"/>
              ${this.createStonePattern(160, 180)}`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-white',
        name: '白牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="3"/>`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-blue',
        name: '藍牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#3498DB" stroke="#2980B9" stroke-width="3"/>`,
        slots: ['top', 'left', 'right']
      },
      {
        id: 'wall-green',
        name: '綠牆',
        category: 'walls',
        width: 160,
        height: 180,
        layer: 1,
        svg: `<rect width="160" height="180" fill="#2ECC71" stroke="#27AE60" stroke-width="3"/>`,
        slots: ['top', 'left', 'right']
      }
    ];
  }

  /**
   * 屋頂元件（6種）
   */
  createRoofs() {
    return [
      {
        id: 'roof-triangle-red',
        name: '紅色三角屋頂',
        category: 'roofs',
        width: 200,
        height: 100,
        layer: 2,
        svg: `<polygon points="100,0 200,100 0,100" fill="#E74C3C" stroke="#C0392B" stroke-width="3"/>
              <line x1="100" y1="0" x2="100" y2="100" stroke="#C0392B" stroke-width="2"/>`,
        requires: 'wall'
      },
      {
        id: 'roof-triangle-blue',
        name: '藍色三角屋頂',
        category: 'roofs',
        width: 200,
        height: 100,
        layer: 2,
        svg: `<polygon points="100,0 200,100 0,100" fill="#3498DB" stroke="#2980B9" stroke-width="3"/>
              <line x1="100" y1="0" x2="100" y2="100" stroke="#2980B9" stroke-width="2"/>`,
        requires: 'wall'
      },
      {
        id: 'roof-triangle-green',
        name: '綠色三角屋頂',
        category: 'roofs',
        width: 200,
        height: 100,
        layer: 2,
        svg: `<polygon points="100,0 200,100 0,100" fill="#2ECC71" stroke="#27AE60" stroke-width="3"/>
              <line x1="100" y1="0" x2="100" y2="100" stroke="#27AE60" stroke-width="2"/>`,
        requires: 'wall'
      },
      {
        id: 'roof-triangle-orange',
        name: '橘色三角屋頂',
        category: 'roofs',
        width: 200,
        height: 100,
        layer: 2,
        svg: `<polygon points="100,0 200,100 0,100" fill="#F39C12" stroke="#E67E22" stroke-width="3"/>
              <line x1="100" y1="0" x2="100" y2="100" stroke="#E67E22" stroke-width="2"/>`,
        requires: 'wall'
      },
      {
        id: 'roof-flat-grey',
        name: '灰色平頂',
        category: 'roofs',
        width: 180,
        height: 30,
        layer: 2,
        svg: `<rect width="180" height="30" fill="#95A5A6" stroke="#7F8C8D" stroke-width="3"/>
              <rect x="5" y="5" width="170" height="10" fill="#BDC3C7"/>`,
        requires: 'wall'
      },
      {
        id: 'roof-dome',
        name: '圓頂',
        category: 'roofs',
        width: 180,
        height: 90,
        layer: 2,
        svg: `<ellipse cx="90" cy="90" rx="90" ry="90" fill="#E67E22" stroke="#D35400" stroke-width="3"/>
              <ellipse cx="90" cy="100" rx="70" ry="70" fill="#F39C12" opacity="0.5"/>`,
        requires: 'wall'
      }
    ];
  }

  /**
   * 門元件（5種）
   */
  createDoors() {
    return [
      {
        id: 'door-wood-brown',
        name: '棕色木門',
        category: 'doors',
        width: 60,
        height: 100,
        layer: 3,
        svg: `<rect width="60" height="100" fill="#8B4513" stroke="#6B3410" stroke-width="2" rx="5"/>
              <rect x="5" y="5" width="25" height="90" fill="#A0522D"/>
              <rect x="30" y="5" width="25" height="90" fill="#A0522D"/>
              <circle cx="45" cy="50" r="3" fill="#FFD700"/>`,
        attachTo: 'wall'
      },
      {
        id: 'door-red',
        name: '紅色門',
        category: 'doors',
        width: 60,
        height: 100,
        layer: 3,
        svg: `<rect width="60" height="100" fill="#E74C3C" stroke="#C0392B" stroke-width="2" rx="5"/>
              <rect x="10" y="10" width="40" height="35" fill="#C0392B" opacity="0.5"/>
              <rect x="10" y="55" width="40" height="35" fill="#C0392B" opacity="0.5"/>
              <circle cx="45" cy="50" r="3" fill="#FFD700"/>`,
        attachTo: 'wall'
      },
      {
        id: 'door-blue',
        name: '藍色門',
        category: 'doors',
        width: 60,
        height: 100,
        layer: 3,
        svg: `<rect width="60" height="100" fill="#3498DB" stroke="#2980B9" stroke-width="2" rx="5"/>
              <rect x="10" y="10" width="40" height="35" fill="#2980B9" opacity="0.5"/>
              <rect x="10" y="55" width="40" height="35" fill="#2980B9" opacity="0.5"/>
              <circle cx="15" cy="50" r="3" fill="#FFD700"/>`,
        attachTo: 'wall'
      },
      {
        id: 'door-glass',
        name: '玻璃門',
        category: 'doors',
        width: 60,
        height: 100,
        layer: 3,
        svg: `<rect width="60" height="100" fill="#ECF0F1" stroke="#95A5A6" stroke-width="2" rx="5"/>
              <rect x="10" y="10" width="40" height="80" fill="#AED6F1" opacity="0.6" stroke="#5DADE2" stroke-width="1"/>
              <circle cx="45" cy="50" r="3" fill="#7F8C8D"/>`,
        attachTo: 'wall'
      },
      {
        id: 'door-arch',
        name: '拱門',
        category: 'doors',
        width: 70,
        height: 110,
        layer: 3,
        svg: `<rect width="70" height="110" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <path d="M 5,110 L 5,40 Q 5,5 35,5 Q 65,5 65,40 L 65,110" fill="#A0522D" stroke="#6B3410" stroke-width="2"/>
              <ellipse cx="35" cy="40" rx="28" ry="35" fill="#D2691E" opacity="0.3"/>`,
        attachTo: 'wall'
      }
    ];
  }

  /**
   * 窗戶元件（6種）
   */
  createWindows() {
    return [
      {
        id: 'window-square',
        name: '方窗',
        category: 'windows',
        width: 50,
        height: 50,
        layer: 3,
        svg: `<rect width="50" height="50" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <line x1="25" y1="0" x2="25" y2="50" stroke="#5DADE2" stroke-width="2"/>
              <line x1="0" y1="25" x2="50" y2="25" stroke="#5DADE2" stroke-width="2"/>`,
        attachTo: 'wall'
      },
      {
        id: 'window-round',
        name: '圓窗',
        category: 'windows',
        width: 50,
        height: 50,
        layer: 3,
        svg: `<circle cx="25" cy="25" r="23" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <line x1="25" y1="2" x2="25" y2="48" stroke="#5DADE2" stroke-width="2"/>
              <line x1="2" y1="25" x2="48" y2="25" stroke="#5DADE2" stroke-width="2"/>`,
        attachTo: 'wall'
      },
      {
        id: 'window-arch',
        name: '拱窗',
        category: 'windows',
        width: 50,
        height: 70,
        layer: 3,
        svg: `<rect x="0" y="25" width="50" height="45" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <path d="M 0,25 Q 0,0 25,0 Q 50,0 50,25" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <line x1="25" y1="0" x2="25" y2="70" stroke="#5DADE2" stroke-width="2"/>`,
        attachTo: 'wall'
      },
      {
        id: 'window-wide',
        name: '寬窗',
        category: 'windows',
        width: 80,
        height: 40,
        layer: 3,
        svg: `<rect width="80" height="40" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <line x1="20" y1="0" x2="20" y2="40" stroke="#5DADE2" stroke-width="2"/>
              <line x1="40" y1="0" x2="40" y2="40" stroke="#5DADE2" stroke-width="2"/>
              <line x1="60" y1="0" x2="60" y2="40" stroke="#5DADE2" stroke-width="2"/>`,
        attachTo: 'wall'
      },
      {
        id: 'window-balcony',
        name: '落地窗',
        category: 'windows',
        width: 60,
        height: 100,
        layer: 3,
        svg: `<rect width="60" height="100" fill="#AED6F1" stroke="#5DADE2" stroke-width="3"/>
              <line x1="30" y1="0" x2="30" y2="100" stroke="#5DADE2" stroke-width="2"/>
              <line x1="0" y1="25" x2="60" y2="25" stroke="#5DADE2" stroke-width="2"/>
              <line x1="0" y1="50" x2="60" y2="50" stroke="#5DADE2" stroke-width="2"/>
              <line x1="0" y1="75" x2="60" y2="75" stroke="#5DADE2" stroke-width="2"/>`,
        attachTo: 'wall'
      },
      {
        id: 'window-small',
        name: '小窗',
        category: 'windows',
        width: 35,
        height: 35,
        layer: 3,
        svg: `<rect width="35" height="35" fill="#AED6F1" stroke="#5DADE2" stroke-width="2"/>
              <line x1="17.5" y1="0" x2="17.5" y2="35" stroke="#5DADE2" stroke-width="1.5"/>
              <line x1="0" y1="17.5" x2="35" y2="17.5" stroke="#5DADE2" stroke-width="1.5"/>`,
        attachTo: 'wall'
      }
    ];
  }

  /**
   * 裝飾元件（12種）
   */
  createDecorations() {
    return [
      {
        id: 'tree-oak',
        name: '橡樹',
        category: 'decorations',
        width: 80,
        height: 120,
        layer: 5,
        svg: `<rect x="32" y="60" width="16" height="60" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <circle cx="40" cy="50" r="35" fill="#27AE60" stroke="#229954" stroke-width="2"/>
              <circle cx="25" cy="40" r="25" fill="#2ECC71" opacity="0.8"/>
              <circle cx="55" cy="40" r="25" fill="#2ECC71" opacity="0.8"/>`
      },
      {
        id: 'tree-pine',
        name: '松樹',
        category: 'decorations',
        width: 60,
        height: 130,
        layer: 5,
        svg: `<rect x="25" y="90" width="10" height="40" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <polygon points="30,0 0,50 60,50" fill="#27AE60" stroke="#229954" stroke-width="2"/>
              <polygon points="30,30 5,70 55,70" fill="#2ECC71" stroke="#229954" stroke-width="2"/>
              <polygon points="30,60 10,90 50,90" fill="#27AE60" stroke="#229954" stroke-width="2"/>`
      },
      {
        id: 'flowers-red',
        name: '紅花',
        category: 'decorations',
        width: 50,
        height: 40,
        layer: 5,
        svg: `<circle cx="10" cy="30" r="8" fill="#E74C3C"/>
              <circle cx="25" cy="25" r="10" fill="#E74C3C"/>
              <circle cx="40" cy="30" r="8" fill="#E74C3C"/>
              <circle cx="10" cy="30" r="3" fill="#F39C12"/>
              <circle cx="25" cy="25" r="4" fill="#F39C12"/>
              <circle cx="40" cy="30" r="3" fill="#F39C12"/>
              <line x1="10" y1="38" x2="10" y2="40" stroke="#27AE60" stroke-width="2"/>
              <line x1="25" y1="35" x2="25" y2="40" stroke="#27AE60" stroke-width="2"/>
              <line x1="40" y1="38" x2="40" y2="40" stroke="#27AE60" stroke-width="2"/>`
      },
      {
        id: 'flowers-yellow',
        name: '黃花',
        category: 'decorations',
        width: 50,
        height: 40,
        layer: 5,
        svg: `<circle cx="10" cy="25" r="7" fill="#F39C12"/>
              <circle cx="25" cy="22" r="9" fill="#F39C12"/>
              <circle cx="40" cy="26" r="7" fill="#F39C12"/>
              <circle cx="10" cy="25" r="3" fill="#E67E22"/>
              <circle cx="25" cy="22" r="3" fill="#E67E22"/>
              <circle cx="40" cy="26" r="3" fill="#E67E22"/>
              <line x1="10" y1="32" x2="10" y2="40" stroke="#27AE60" stroke-width="2"/>
              <line x1="25" y1="31" x2="25" y2="40" stroke="#27AE60" stroke-width="2"/>
              <line x1="40" y1="33" x2="40" y2="40" stroke="#27AE60" stroke-width="2"/>`
      },
      {
        id: 'fence-wood',
        name: '木柵欄',
        category: 'decorations',
        width: 150,
        height: 60,
        layer: 4,
        svg: `<rect x="0" y="20" width="150" height="5" fill="#8B4513"/>
              <rect x="0" y="35" width="150" height="5" fill="#8B4513"/>
              <rect x="10" y="0" width="15" height="60" fill="#A0522D" stroke="#8B4513" stroke-width="2"/>
              <rect x="45" y="5" width="15" height="55" fill="#A0522D" stroke="#8B4513" stroke-width="2"/>
              <rect x="80" y="0" width="15" height="60" fill="#A0522D" stroke="#8B4513" stroke-width="2"/>
              <rect x="115" y="5" width="15" height="55" fill="#A0522D" stroke="#8B4513" stroke-width="2"/>`
      },
      {
        id: 'fence-picket',
        name: '尖樁柵欄',
        category: 'decorations',
        width: 150,
        height: 70,
        layer: 4,
        svg: `<rect x="0" y="30" width="150" height="5" fill="#ECF0F1"/>
              <polygon points="10,0 15,10 5,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="7" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="30,0 35,10 25,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="27" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="50,0 55,10 45,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="47" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="70,0 75,10 65,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="67" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="90,0 95,10 85,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="87" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="110,0 115,10 105,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="107" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <polygon points="130,0 135,10 125,10" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>
              <rect x="127" y="10" width="6" height="30" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="1"/>`
      },
      {
        id: 'chimney',
        name: '煙囪',
        category: 'decorations',
        width: 40,
        height: 80,
        layer: 2,
        svg: `<rect width="40" height="80" fill="#C0392B" stroke="#A93226" stroke-width="2"/>
              ${this.createBrickPattern(40, 80, '#E74C3C')}
              <rect x="5" y="0" width="30" height="10" fill="#7F8C8D"/>
              <ellipse cx="20" cy="15" rx="8" ry="5" fill="#BDC3C7" opacity="0.7"/>
              <ellipse cx="18" cy="10" rx="10" ry="6" fill="#ECF0F1" opacity="0.6"/>`
      },
      {
        id: 'lamp-post',
        name: '路燈',
        category: 'decorations',
        width: 30,
        height: 100,
        layer: 5,
        svg: `<rect x="12" y="30" width="6" height="70" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="1"/>
              <rect x="10" y="100" width="10" height="5" fill="#5D6D7E"/>
              <rect x="5" y="15" width="20" height="20" fill="#F39C12" stroke="#E67E22" stroke-width="2" rx="3"/>
              <circle cx="15" cy="25" r="8" fill="#FCF3CF" opacity="0.8"/>`
      },
      {
        id: 'bench',
        name: '長椅',
        category: 'decorations',
        width: 80,
        height: 50,
        layer: 5,
        svg: `<rect x="10" y="25" width="60" height="8" fill="#8B4513" stroke="#6B3410" stroke-width="2" rx="2"/>
              <rect x="5" y="15" width="8" height="25" fill="#A0522D" stroke="#8B4513" stroke-width="1"/>
              <rect x="67" y="15" width="8" height="25" fill="#A0522D" stroke="#8B4513" stroke-width="1"/>
              <rect x="5" y="10" width="70" height="8" fill="#8B4513" stroke="#6B3410" stroke-width="2" rx="2"/>`
      },
      {
        id: 'mailbox',
        name: '信箱',
        category: 'decorations',
        width: 40,
        height: 60,
        layer: 5,
        svg: `<rect x="15" y="30" width="10" height="30" fill="#7F8C8D" stroke="#5D6D7E" stroke-width="1"/>
              <rect x="5" y="15" width="30" height="20" fill="#E74C3C" stroke="#C0392B" stroke-width="2" rx="3"/>
              <path d="M 5,15 Q 5,5 20,5 Q 35,5 35,15" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
              <rect x="25" y="23" width="8" height="6" fill="#F4D03F" stroke="#F39C12" stroke-width="1"/>`
      },
      {
        id: 'bush',
        name: '灌木叢',
        category: 'decorations',
        width: 60,
        height: 40,
        layer: 5,
        svg: `<ellipse cx="30" cy="30" rx="28" ry="20" fill="#27AE60" stroke="#229954" stroke-width="2"/>
              <circle cx="15" cy="25" r="15" fill="#2ECC71" opacity="0.8"/>
              <circle cx="45" cy="25" r="15" fill="#2ECC71" opacity="0.8"/>
              <circle cx="30" cy="20" r="12" fill="#52BE80" opacity="0.9"/>`
      },
      {
        id: 'swing',
        name: '鞦韆',
        category: 'decorations',
        width: 100,
        height: 120,
        layer: 5,
        svg: `<rect x="10" y="0" width="8" height="90" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <rect x="82" y="0" width="8" height="90" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
              <rect x="10" y="10" width="80" height="8" fill="#A0522D" stroke="#8B4513" stroke-width="2"/>
              <line x1="40" y1="18" x2="40" y2="80" stroke="#7F8C8D" stroke-width="2"/>
              <line x1="60" y1="18" x2="60" y2="80" stroke="#7F8C8D" stroke-width="2"/>
              <rect x="30" y="75" width="40" height="10" fill="#E74C3C" stroke="#C0392B" stroke-width="2" rx="2"/>`
      }
    ];
  }

  /**
   * 輔助方法：創建磚塊圖案
   */
  createBrickPattern(width, height, color = '#E74C3C') {
    let pattern = '';
    const brickWidth = 40;
    const brickHeight = 20;
    
    for (let y = 5; y < height - 5; y += brickHeight) {
      for (let x = 5; x < width - 5; x += brickWidth) {
        const offset = (Math.floor(y / brickHeight) % 2) * (brickWidth / 2);
        pattern += `<rect x="${x + offset}" y="${y}" width="${brickWidth - 2}" height="${brickHeight - 2}" fill="${color}" opacity="0.5"/>`;
      }
    }
    return pattern;
  }

  /**
   * 輔助方法：創建木紋圖案
   */
  createWoodPattern(width, height, color = '#A0522D') {
    let pattern = '';
    for (let i = 0; i < 5; i++) {
      const y = 20 + i * 30;
      pattern += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="${color}" stroke-width="2" opacity="0.4"/>`;
    }
    return pattern;
  }

  /**
   * 輔助方法：創建石頭圖案
   */
  createStonePattern(width, height) {
    let pattern = '';
    const stones = [
      { x: 20, y: 30, r: 15 },
      { x: 60, y: 50, r: 12 },
      { x: 100, y: 35, r: 18 },
      { x: 40, y: 80, r: 14 },
      { x: 90, y: 90, r: 16 },
      { x: 130, y: 70, r: 13 }
    ];
    
    stones.forEach(stone => {
      if (stone.x < width && stone.y < height) {
        pattern += `<circle cx="${stone.x}" cy="${stone.y}" r="${stone.r}" fill="#5D6D7E" opacity="0.3"/>`;
      }
    });
    
    return pattern;
  }

  /**
   * 獲取所有元件（扁平化）
   */
  getAllComponents() {
    const all = [];
    Object.keys(this.components).forEach(category => {
      all.push(...this.components[category]);
    });
    return all;
  }

  /**
   * 根據類別獲取元件
   */
  getComponentsByCategory(category) {
    if (category === 'all') {
      return this.getAllComponents();
    }
    return this.components[category] || [];
  }

  /**
   * 根據 ID 獲取元件
   */
  getComponentById(id) {
    return this.getAllComponents().find(comp => comp.id === id);
  }

  /**
   * 獲取元件總數
   */
  getTotalCount() {
    return this.getAllComponents().length;
  }
}
