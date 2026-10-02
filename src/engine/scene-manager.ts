export class SceneManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentScene: string = 'hero';
  private scrollProgress: number = 0;
  private isCalmMode: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  public setMode(calm: boolean) {
    this.isCalmMode = calm;
  }

  public updateScroll(progress: number, section: string) {
    this.scrollProgress = progress;
    this.currentScene = section;
  }

  public render(time: number, dt: number, pointer: {x: number, y: number}) {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // This is where we would branch into different scenes.
    // 1. HERO: "Code Tunnel"
    // 2. WORK: "Sorting Visualizer"
    // 3. ABOUT: "Binary Search Tree"
    // 4. EXPERIENCE: "Git Graph"
    // 5. CONTACT: "TCP Handshake"

    if (this.currentScene === 'hero') {
      this.renderHeroScene(time, dt, pointer);
    } else if (this.currentScene === 'work') {
      this.renderWorkScene(time);
    } else {
      this.renderFallbackScene(time);
    }
  }

  private renderHeroScene(time: number, dt: number, pointer: {x: number, y: number}) {
    const { width, height } = this.canvas;
    this.ctx.save();
    
    // White crystal-like glow
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    
    // Global parallax offset based on pointer position relative to center
    const ptrX = pointer.x === -1000 ? width / 2 : pointer.x;
    const ptrY = pointer.y === -1000 ? height / 2 : pointer.y;
    const parallaxX = (ptrX - width / 2) * -0.05;
    const parallaxY = (ptrY - height / 2) * -0.05;
    
    const numNodes = this.isCalmMode ? 30 : 80;
    for (let i = 0; i < numNodes; i++) {
      let x = (Math.sin(time * 0.001 + i) * width * 0.4) + width / 2 + parallaxX;
      let y = ((time * 0.05 + i * 50) % height) + parallaxY;
      
      const distToPtr = Math.hypot(x - ptrX, y - ptrY);
      const isHovered = distToPtr < 200;
      
      // Gravity well: pull nodes towards the pointer if they are close
      if (isHovered && pointer.x !== -1000) {
        const pull = 1 - (distToPtr / 200); // 0 to 1
        x += (ptrX - x) * pull * 0.15;
        y += (ptrY - y) * pull * 0.15;
      }
      
      this.ctx.shadowBlur = isHovered ? 15 : 4;
      
      this.ctx.beginPath();
      // Crystal shape (diamond)
      const size = isHovered ? 5 : 2;
      this.ctx.moveTo(x, y - size);
      this.ctx.lineTo(x + size, y);
      this.ctx.lineTo(x, y + size);
      this.ctx.lineTo(x - size, y);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private renderWorkScene(time: number) {
    const { width, height } = this.canvas;
    this.ctx.save();
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    this.ctx.shadowBlur = 8;
    
    const bars = 48;
    const barWidth = width / bars;
    
    for (let i = 0; i < bars; i++) {
      const h = Math.abs(Math.sin(i * 0.1 + this.scrollProgress * 10)) * 100;
      this.ctx.fillRect(i * barWidth + 2, height - h, barWidth - 4, h);
    }
    
    this.ctx.restore();
  }

  private renderFallbackScene(time: number) {
    const { width, height } = this.canvas;
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(200, 200, 200, 0.05)';
    for(let i=0; i<10; i++) {
      this.ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
    this.ctx.restore();
  }
}
