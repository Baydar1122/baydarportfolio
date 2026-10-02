export interface ContourRendererOptions {
  canvas: HTMLCanvasElement;
  getAccentColor: () => [number, number, number];
  getBgColor: () => [number, number, number];
  isReducedMotion: () => boolean;
}

export class ContourRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private animFrameId: number | null = null;
  private startTime = performance.now();
  private lastFrameTime = performance.now();
  private dpr = 1;
  private isRunning = false;
  private isVisible = true;

  // Uniform locations
  private uResolutionLoc: WebGLUniformLocation | null = null;
  private uMouseLoc: WebGLUniformLocation | null = null;
  private uTimeLoc: WebGLUniformLocation | null = null;
  private uAccentLoc: WebGLUniformLocation | null = null;
  private uBgLoc: WebGLUniformLocation | null = null;

  // Target mouse position and smoothed spring mouse position
  private targetMouse = { x: 0, y: 0 };
  private currentMouse = { x: 0, y: 0 };

  private getAccentColor: () => [number, number, number];
  private getBgColor: () => [number, number, number];
  private isReducedMotion: () => boolean;

  constructor(options: ContourRendererOptions) {
    this.canvas = options.canvas;
    this.getAccentColor = options.getAccentColor;
    this.getBgColor = options.getBgColor;
    this.isReducedMotion = options.isReducedMotion;

    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.initGL();
    this.setupEvents();
  }

  private initGL() {
    this.gl = this.canvas.getContext('webgl', { alpha: false, antialias: true, powerPreference: 'high-performance' });
    if (!this.gl) {
      console.warn('[ContourRenderer] WebGL not supported. Falling back to static SVG contour.');
      return;
    }

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform vec3 u_accent_color;
      uniform vec3 u_bg_color;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        vec2 mouseNorm = u_mouse / u_resolution.xy;
        
        st.x *= u_resolution.x / u_resolution.y;
        mouseNorm.x *= u_resolution.x / u_resolution.y;

        vec2 distVec = st - mouseNorm;
        float dist = length(distVec);
        float repelRadius = 0.45;
        float repelFactor = smoothstep(repelRadius, 0.0, dist) * 0.14;
        vec2 stRepelled = st + normalize(distVec + vec2(0.0001)) * repelFactor;

        float t = u_time * 0.06;
        float n1 = snoise(stRepelled * 2.8 + vec2(t * 0.4, t * 0.2));
        float n2 = snoise(stRepelled * 5.2 - vec2(t * 0.2, t * 0.3)) * 0.5;
        float val = (n1 + n2 + 1.5) * 5.0;

        float lineVal = fract(val);
        float line = smoothstep(0.045, 0.0, abs(lineVal - 0.5) - 0.015);
        
        vec3 color = mix(u_bg_color, u_accent_color, line * 0.25);
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const gl = this.gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    this.program = gl.createProgram();
    if (!this.program) return;
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('[ContourRenderer] Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }

    gl.useProgram(this.program);

    // Quad geometry covering screen
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    this.uResolutionLoc = gl.getUniformLocation(this.program, 'u_resolution');
    this.uMouseLoc = gl.getUniformLocation(this.program, 'u_mouse');
    this.uTimeLoc = gl.getUniformLocation(this.program, 'u_time');
    this.uAccentLoc = gl.getUniformLocation(this.program, 'u_accent_color');
    this.uBgLoc = gl.getUniformLocation(this.program, 'u_bg_color');

    this.resize();
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('[ContourRenderer] Compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  public resize() {
    if (!this.canvas || !this.gl) return;
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    
    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Default center mouse
    if (this.targetMouse.x === 0 && this.targetMouse.y === 0) {
      this.targetMouse.x = this.canvas.width / 2;
      this.targetMouse.y = this.canvas.height / 2;
      this.currentMouse.x = this.targetMouse.x;
      this.currentMouse.y = this.targetMouse.y;
    }
  }

  private setupEvents() {
    const handlePointerMove = (e: PointerEvent) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * this.dpr;
      const y = (rect.height - (e.clientY - rect.top)) * this.dpr;
      this.targetMouse = { x, y };
    };

    const handleTouchScroll = () => {
      if ('ontouchstart' in window) {
        const scrollY = window.scrollY || window.pageYOffset;
        this.targetMouse.y = (scrollY * 0.5) % (this.canvas.height || 1000);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleTouchScroll, { passive: true });
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Page Visibility API pause
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.render();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private render = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Performance budget check: auto reduce DPR if frame time exceeds 20ms
    if (frameTime > 20 && this.dpr > 1.0) {
      this.dpr = 1.0;
      this.resize();
    }

    if (this.isVisible && this.gl && this.program && !this.isReducedMotion()) {
      // Smooth mouse position with spring inertia
      this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * 0.08;
      this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * 0.08;

      const time = (now - this.startTime) / 1000;
      const accent = this.getAccentColor();
      const bg = this.getBgColor();

      this.gl.useProgram(this.program);
      this.gl.uniform2f(this.uResolutionLoc, this.canvas.width, this.canvas.height);
      this.gl.uniform2f(this.uMouseLoc, this.currentMouse.x, this.currentMouse.y);
      this.gl.uniform1f(this.uTimeLoc, time);
      this.gl.uniform3f(this.uAccentLoc, accent[0] / 255, accent[1] / 255, accent[2] / 255);
      this.gl.uniform3f(this.uBgLoc, bg[0] / 255, bg[1] / 255, bg[2] / 255);

      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    this.animFrameId = requestAnimationFrame(this.render);
  };

  public destroy() {
    this.stop();
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}
