import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Node {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  pulse: number;
  highlight: boolean;
}

@Component({
  selector: 'app-blueprint-grid',
  standalone: true,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: [`
    :host { position: absolute; inset: 0; display: block; }
    canvas { width: 100%; height: 100%; display: block; }
  `],
})
export class BlueprintGridComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private rafId = 0;
  private resizeObs?: ResizeObserver;

  private width = 0;
  private height = 0;
  private dpr = 1;

  private rotation = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;
  private mouseX = 0;
  private mouseY = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cv = this.canvasRef.nativeElement;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;

    this.setupSize();
    this.buildNodes(110);

    this.resizeObs = new ResizeObserver(() => this.setupSize());
    this.resizeObs.observe(cv.parentElement ?? cv);

    this.zone.runOutsideAngular(() => this.tick());
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.resizeObs?.disconnect();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouse(e: MouseEvent): void {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.targetMouseX = (e.clientX / w - 0.5) * 2;
    this.targetMouseY = (e.clientY / h - 0.5) * 2;
  }

  private setupSize(): void {
    const cv = this.canvasRef.nativeElement;
    const host = cv.parentElement ?? cv;
    const rect = host.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    cv.width = Math.floor(this.width * this.dpr);
    cv.height = Math.floor(this.height * this.dpr);
    cv.style.width = `${this.width}px`;
    cv.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private buildNodes(count: number): void {
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
        vz: (Math.random() - 0.5) * 0.0006,
        pulse: Math.random() * Math.PI * 2,
        highlight: Math.random() < 0.18,
      });
    }
  }

  private readonly tick = (): void => {
    this.rafId = requestAnimationFrame(this.tick);
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    this.rotation += 0.0008;
    this.draw();
  };

  private draw(): void {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    ctx.clearRect(0, 0, W, H);

    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    const cx = W / 2;
    const cy = H / 2;
    // Use largura como referência: nós em [-1,1] cobrem 100% da largura
    const scaleX = W * 0.55;
    const scaleY = H * 0.55;
    const fov = 900;

    const projected: { sx: number; sy: number; sz: number; pulse: number; highlight: boolean }[] = [];

    for (const n of this.nodes) {
      n.x += n.vx; n.y += n.vy; n.z += n.vz;
      if (n.x > 1 || n.x < -1) n.vx *= -1;
      if (n.y > 1 || n.y < -1) n.vy *= -1;
      if (n.z > 1 || n.z < -1) n.vz *= -1;
      n.pulse += 0.012;

      // rotate around Y axis for 3D feel
      const rx = n.x * cos - n.z * sin;
      const rz = n.x * sin + n.z * cos;

      // soft mouse parallax
      const px = rx + this.mouseX * 0.05;
      const py = n.y + this.mouseY * 0.05;

      const perspRef = (scaleX + scaleY) * 0.5;
      const persp = fov / (fov + rz * perspRef);
      const sx = cx + px * scaleX * persp;
      const sy = cy + py * scaleY * persp;

      projected.push({ sx, sy, sz: rz, pulse: n.pulse, highlight: n.highlight });
    }

    // edges — platinum hairlines
    const maxDist = Math.min(W, H) * 0.16;
    const maxDistSq = maxDist * maxDist;
    ctx.lineWidth = 0.6;
    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];
      for (let j = i + 1; j < projected.length; j++) {
        const b = projected[j];
        const dx = a.sx - b.sx;
        const dy = a.sy - b.sy;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDistSq) {
          const t = 1 - Math.sqrt(d2) / maxDist;
          const indigoLink = a.highlight && b.highlight;
          if (indigoLink) {
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.10 + t * 0.22})`;
          } else {
            ctx.strokeStyle = `rgba(229, 233, 242, ${0.04 + t * 0.09})`;
          }
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
    }

    // nodes
    for (const p of projected) {
      const depth01 = (p.sz + 1) / 2; // 0 back .. 1 front
      const depthAlpha = 0.55 + depth01 * 0.45;
      const radius = 1.1 + depth01 * 0.8;
      const pulseT = (Math.sin(p.pulse) + 1) / 2;

      if (p.highlight) {
        const glowR = 5 + pulseT * 5 + depth01 * 2;
        const grad = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, glowR);
        grad.addColorStop(0, `rgba(96, 165, 250, ${0.6 * depthAlpha})`);
        grad.addColorStop(0.45, `rgba(79, 70, 229, ${0.35 * depthAlpha})`);
        grad.addColorStop(1, 'rgba(79, 70, 229, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(129, 140, 248, ${0.95 * depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius + 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(229, 233, 242, ${0.42 * depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
