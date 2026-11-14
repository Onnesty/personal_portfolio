import { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';

interface BadgeData {
  name: string;
  role: string;
  idNumber: string;
  clearance: string;
  organization: string;
  department: string;
  zone: string;
  issuedDate: string;
}

export interface HangingIdBadgeProps extends Partial<BadgeData> {
  className?: string;
  style?: CSSProperties;
}

function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('A 2D canvas context is required to render the badge.');
  return context;
}

const THEME = {
  bg: '#0F1319',
  bg2: '#141920',
  bg3: '#1a2130',
  bg4: '#1E2838',
  text: '#E4EEF8',
  sky: '#4a9ee8',
  sky2: '#7EC8F0',
  border: '#1E3050',
  border2: '#203457',
  titleFont: "'Outfit', sans-serif",
  textFont: "'Onest', sans-serif",
};

function createRoundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function generateCardTextures(data: BadgeData) {
  const width = 1024;
  const height = 1600;
  const radius = 64;

  // --- FRONT CANVAS ---
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = width;
  frontCanvas.height = height;
  const ctx = getCanvasContext(frontCanvas);

  ctx.save();
  createRoundedRectPath(ctx, 0, 0, width, height, radius);
  ctx.clip();

  // Base gradient using --background-2 and --background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, THEME.bg2);
  bgGrad.addColorStop(0.55, THEME.bg);
  bgGrad.addColorStop(1, THEME.bg3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle architectural grid
  ctx.strokeStyle = 'rgba(74, 158, 232, 0.06)';
  ctx.lineWidth = 2;
  for (let gx = 0; gx < width; gx += 64) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += 64) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }

  // Top atmospheric sky glow
  const glow = ctx.createRadialGradient(width * 0.5, 140, 20, width * 0.5, 140, 620);
  glow.addColorStop(0, 'rgba(74, 158, 232, 0.24)');
  glow.addColorStop(0.5, 'rgba(126, 200, 240, 0.08)');
  glow.addColorStop(1, 'rgba(15, 19, 25, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 750);

  // Lanyard slot cutout indicator
  ctx.fillStyle = '#090c10';
  createRoundedRectPath(ctx, width / 2 - 90, 46, 180, 32, 16);
  ctx.fill();
  ctx.strokeStyle = THEME.border2;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Header brand & status pill
  ctx.fillStyle = THEME.sky2;
  ctx.font = `700 26px ${THEME.titleFont}`;
  ctx.letterSpacing = '4px';
  ctx.fillText(data.organization.toUpperCase(), 72, 155);
  ctx.letterSpacing = '0px';

  // Active status badge
  ctx.fillStyle = THEME.bg4;
  createRoundedRectPath(ctx, width - 290, 122, 218, 46, 23);
  ctx.fill();
  ctx.strokeStyle = THEME.border2;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = THEME.sky;
  ctx.beginPath();
  ctx.arc(width - 258, 145, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = THEME.text;
  ctx.font = `600 20px ${THEME.textFont}`;
  ctx.fillText(data.clearance.toUpperCase(), width - 238, 152);

  // Avatar frame (--background-3 & --border-2)
  const avatarX = 72;
  const avatarY = 225;
  const avatarSize = 340;

  ctx.fillStyle = THEME.bg3;
  createRoundedRectPath(ctx, avatarX, avatarY, avatarSize, avatarSize, 36);
  ctx.fill();
  ctx.strokeStyle = THEME.border2;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Stylized geometric silhouette inside avatar
  ctx.save();
  createRoundedRectPath(ctx, avatarX, avatarY, avatarSize, avatarSize, 36);
  ctx.clip();

  const avGrad = ctx.createLinearGradient(avatarX, avatarY, avatarX + avatarSize, avatarY + avatarSize);
  avGrad.addColorStop(0, THEME.bg4);
  avGrad.addColorStop(1, THEME.bg);
  ctx.fillStyle = avGrad;
  ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

  // Accent ring
  ctx.strokeStyle = 'rgba(126, 200, 240, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, 125, 0, Math.PI * 2);
  ctx.stroke();

  // Head & shoulders vector
  ctx.fillStyle = THEME.sky;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + 135, 54, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = THEME.sky2;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + 325, 118, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  // Metallic EMV Smart Chip beside avatar
  const chipX = 465;
  const chipY = 245;
  const chipW = 124;
  const chipH = 96;
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  chipGrad.addColorStop(0, THEME.sky2);
  chipGrad.addColorStop(0.5, THEME.sky);
  chipGrad.addColorStop(1, '#2b6cb0');
  ctx.fillStyle = chipGrad;
  createRoundedRectPath(ctx, chipX, chipY, chipW, chipH, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(15, 19, 25, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(chipX + 42, chipY);
  ctx.lineTo(chipX + 42, chipY + chipH);
  ctx.moveTo(chipX + 82, chipY);
  ctx.lineTo(chipX + 82, chipY + chipH);
  ctx.moveTo(chipX, chipY + 32);
  ctx.lineTo(chipX + chipW, chipY + 32);
  ctx.moveTo(chipX, chipY + 64);
  ctx.lineTo(chipX + chipW, chipY + 64);
  ctx.stroke();

  // Credential metadata right of avatar
  ctx.fillStyle = 'rgba(228, 238, 248, 0.55)';
  ctx.font = `500 22px ${THEME.textFont}`;
  ctx.fillText('CREDENTIAL ID', 465, 405);

  ctx.fillStyle = THEME.sky2;
  ctx.font = `700 34px ${THEME.titleFont}`;
  ctx.fillText(data.idNumber, 465, 448);

  ctx.fillStyle = 'rgba(228, 238, 248, 0.55)';
  ctx.font = `500 22px ${THEME.textFont}`;
  ctx.fillText('ISSUED', 465, 512);

  ctx.fillStyle = THEME.text;
  ctx.font = `600 28px ${THEME.textFont}`;
  ctx.fillText(data.issuedDate, 465, 550);

  // Divider line
  ctx.strokeStyle = THEME.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(72, 635);
  ctx.lineTo(width - 72, 635);
  ctx.stroke();

  // Holder Name & Title
  ctx.fillStyle = THEME.text;
  ctx.font = `700 76px ${THEME.titleFont}`;
  ctx.fillText(data.name, 72, 745);

  ctx.fillStyle = THEME.sky;
  ctx.font = `500 36px ${THEME.textFont}`;
  ctx.fillText(data.role, 72, 808);

  // Info Cards Grid
  const boxY = 885;
  const boxH = 155;
  const boxW = (width - 144 - 28) / 2;

  // Box 1: Department
  ctx.fillStyle = THEME.bg3;
  createRoundedRectPath(ctx, 72, boxY, boxW, boxH, 24);
  ctx.fill();
  ctx.strokeStyle = THEME.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(228, 238, 248, 0.55)';
  ctx.font = `500 22px ${THEME.textFont}`;
  ctx.fillText('DEPARTMENT', 102, boxY + 52);

  ctx.fillStyle = THEME.text;
  ctx.font = `600 32px ${THEME.titleFont}`;
  ctx.fillText(data.department, 102, boxY + 106);

  // Box 2: Access Zone
  ctx.fillStyle = THEME.bg3;
  createRoundedRectPath(ctx, 72 + boxW + 28, boxY, boxW, boxH, 24);
  ctx.fill();
  ctx.strokeStyle = THEME.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(228, 238, 248, 0.55)';
  ctx.font = `500 22px ${THEME.textFont}`;
  ctx.fillText('ACCESS ZONE', 102 + boxW + 28, boxY + 52);

  ctx.fillStyle = THEME.sky2;
  ctx.font = `600 32px ${THEME.titleFont}`;
  ctx.fillText(data.zone, 102 + boxW + 28, boxY + 106);

  // Bottom Barcode & Verification Footer
  const footerY = 1120;
  ctx.fillStyle = THEME.bg2;
  createRoundedRectPath(ctx, 72, footerY, width - 144, 390, 28);
  ctx.fill();
  ctx.strokeStyle = THEME.border2;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Procedural crisp barcode
  const barStartX = 116;
  const barY = footerY + 54;
  const barH = 140;
  let cursorX = barStartX;
  const pattern = [4, 2, 8, 3, 2, 6, 4, 2, 10, 2, 4, 6, 2, 3, 8, 2, 4, 2, 6, 4, 8, 2, 3, 4, 6, 2, 8, 4, 2, 6, 3, 4, 8, 2];
  pattern.forEach((w, idx) => {
    if (idx % 2 === 0) {
      ctx.fillStyle = idx % 4 === 0 ? THEME.text : THEME.sky2;
      ctx.fillRect(cursorX, barY, w * 4.2, barH);
    }
    cursorX += w * 4.8;
  });

  // Serial hash text under barcode
  ctx.fillStyle = 'rgba(228, 238, 248, 0.65)';
  ctx.font = `500 24px monospace`;
  ctx.fillText(`SHA256 // ${data.idNumber}-VERIFIED-2026`, 116, barY + barH + 52);

  // Bottom security micro-strip
  ctx.fillStyle = THEME.sky;
  ctx.fillRect(116, footerY + 305, 140, 8);
  ctx.fillStyle = THEME.border2;
  ctx.fillRect(272, footerY + 305, width - 388, 8);

  // Inner card border rim
  ctx.strokeStyle = THEME.border2;
  ctx.lineWidth = 6;
  createRoundedRectPath(ctx, 3, 3, width - 6, height - 6, radius);
  ctx.stroke();
  ctx.restore();

  // --- BACK CANVAS ---
  const backCanvas = document.createElement('canvas');
  backCanvas.width = width;
  backCanvas.height = height;
  const bctx = getCanvasContext(backCanvas);

  bctx.save();
  createRoundedRectPath(bctx, 0, 0, width, height, radius);
  bctx.clip();

  bctx.fillStyle = THEME.bg;
  bctx.fillRect(0, 0, width, height);

  // Lanyard slot cutout
  bctx.fillStyle = '#090c10';
  createRoundedRectPath(bctx, width / 2 - 90, 46, 180, 32, 16);
  bctx.fill();
  bctx.strokeStyle = THEME.border2;
  bctx.lineWidth = 3;
  bctx.stroke();

  // Magnetic Stripe
  const magGrad = bctx.createLinearGradient(0, 140, width, 280);
  magGrad.addColorStop(0, '#070a0e');
  magGrad.addColorStop(0.5, THEME.bg3);
  magGrad.addColorStop(1, '#070a0e');
  bctx.fillStyle = magGrad;
  bctx.fillRect(0, 145, width, 135);

  bctx.strokeStyle = THEME.border;
  bctx.lineWidth = 2;
  bctx.beginPath();
  bctx.moveTo(0, 145);
  bctx.lineTo(width, 145);
  bctx.moveTo(0, 280);
  bctx.lineTo(width, 280);
  bctx.stroke();

  // Signature Strip
  bctx.fillStyle = 'rgba(228, 238, 248, 0.55)';
  bctx.font = `600 22px ${THEME.textFont}`;
  bctx.fillText('AUTHORIZED SIGNATURE', 72, 365);

  bctx.fillStyle = THEME.bg3;
  createRoundedRectPath(bctx, 72, 390, width - 144, 115, 18);
  bctx.fill();
  bctx.strokeStyle = THEME.border2;
  bctx.lineWidth = 2;
  bctx.stroke();

  // Cursive-style vector signature
  bctx.strokeStyle = THEME.sky2;
  bctx.lineWidth = 4;
  bctx.beginPath();
  bctx.moveTo(120, 465);
  bctx.bezierCurveTo(170, 395, 210, 490, 265, 435);
  bctx.bezierCurveTo(310, 390, 340, 480, 415, 440);
  bctx.bezierCurveTo(465, 415, 510, 465, 595, 445);
  bctx.stroke();

  // Security Policy Terms
  bctx.fillStyle = THEME.text;
  bctx.font = `700 30px ${THEME.titleFont}`;
  bctx.fillText('SECURITY & ACCESS PROTOCOL', 72, 600);

  const terms = [
    '1. This credential remains the property of the issuing organization.',
    '2. Must be worn visibly at all times within restricted facilities.',
    '3. Unauthorized duplication, transfer, or alteration is prohibited.',
    '4. Report lost or compromised credentials immediately to security.',
  ];

  bctx.fillStyle = 'rgba(228, 238, 248, 0.72)';
  bctx.font = `400 25px ${THEME.textFont}`;
  terms.forEach((line, i) => {
    bctx.fillText(line, 72, 665 + i * 54);
  });

  // Procedural Matrix / QR Block
  const qrSize = 240;
  const qrX = 72;
  const qrY = 940;
  bctx.fillStyle = THEME.bg2;
  createRoundedRectPath(bctx, qrX, qrY, qrSize, qrSize, 24);
  bctx.fill();
  bctx.strokeStyle = THEME.border2;
  bctx.lineWidth = 2;
  bctx.stroke();

  const cells = 9;
  const cellSize = (qrSize - 48) / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      if ((r * 7 + c * 13) % 3 === 0 || (r < 2 && c < 2) || (r > 6 && c > 6)) {
        bctx.fillStyle = (r + c) % 2 === 0 ? THEME.sky : THEME.text;
        bctx.fillRect(qrX + 24 + c * cellSize, qrY + 24 + r * cellSize, cellSize - 3, cellSize - 3);
      }
    }
  }

  // Emergency / Return Contact Info next to QR
  bctx.fillStyle = THEME.sky2;
  bctx.font = `700 26px ${THEME.titleFont}`;
  bctx.fillText('ENCRYPTED NFC ENABLED', 350, 995);

  bctx.fillStyle = 'rgba(228, 238, 248, 0.7)';
  bctx.font = `400 24px ${THEME.textFont}`;
  bctx.fillText('Tap badge against any Level-3', 350, 1045);
  bctx.fillText('biometric reader for instant auth.', 350, 1082);

  bctx.fillStyle = THEME.sky;
  bctx.font = `600 24px ${THEME.textFont}`;
  bctx.fillText(`ID: ${data.idNumber}`, 350, 1145);

  // Bottom wordmark
  bctx.fillStyle = 'rgba(228, 238, 248, 0.4)';
  bctx.font = `700 24px ${THEME.titleFont}`;
  bctx.fillText(`${data.organization.toUpperCase()} // ACCESS CONTROL`, 72, 1485);

  bctx.strokeStyle = THEME.border2;
  bctx.lineWidth = 6;
  createRoundedRectPath(bctx, 3, 3, width - 6, height - 6, radius);
  bctx.stroke();
  bctx.restore();

  const frontTex = new THREE.CanvasTexture(frontCanvas);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  frontTex.anisotropy = 8;

  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = 8;

  return { frontTex, backTex };
}

function generateLanyardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = getCanvasContext(canvas);

  // Woven strap base (--background-4)
  ctx.fillStyle = THEME.bg4;
  ctx.fillRect(0, 0, 256, 1024);

  // Subtle diagonal nylon weave
  ctx.strokeStyle = 'rgba(228, 238, 248, 0.05)';
  ctx.lineWidth = 2;
  for (let y = -256; y < 1280; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + 128);
    ctx.stroke();
  }

  // Sky accent edge stitching
  ctx.fillStyle = THEME.sky;
  ctx.fillRect(14, 0, 6, 1024);
  ctx.fillRect(236, 0, 6, 1024);

  // Center subtle stripe
  ctx.fillStyle = 'rgba(126, 200, 240, 0.16)';
  ctx.fillRect(118, 0, 20, 1024);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  return tex;
}

export default function HangingIdBadge({
  name = 'ELENA ROSTOVA',
  role = 'Principal Systems Architect',
  idNumber = 'NX-8842-90',
  clearance = 'LEVEL 04',
  organization = 'AETHER DYNAMICS',
  department = 'Core Infrastructure',
  zone = 'SECTOR 7G',
  issuedDate = 'NOV 2026',
  className = '',
  style = {},
}: HangingIdBadgeProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 650;

    // Scene & Transparent Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, -0.35, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Studio Lighting tailored to --sky and --sky-2
    const ambientLight = new THREE.AmbientLight(0xe4eef8, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 7);
    scene.add(keyLight);

    const skyRimLight = new THREE.PointLight(0x4a9ee8, 4.5, 18);
    skyRimLight.position.set(-4.5, 2.5, 4);
    scene.add(skyRimLight);

    const iceRimLight = new THREE.PointLight(0x7ec8f0, 3.2, 16);
    iceRimLight.position.set(4.5, -3.5, 3.5);
    scene.add(iceRimLight);

    // Textures
    const { frontTex, backTex } = generateCardTextures({
      name,
      role,
      idNumber,
      clearance,
      organization,
      department,
      zone,
      issuedDate,
    });
    const lanyardTex = generateLanyardTexture();

    // Badge Pivot Group (origin at top clasp attachment point)
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // Rounded Card Extruded Geometry
    const cardW = 2.24;
    const cardH = 3.5;
    const cardR = 0.14;
    const cardDepth = 0.045;

    const shape = new THREE.Shape();
    const x = -cardW / 2;
    const y = -cardH;
    shape.moveTo(x + cardR, y);
    shape.lineTo(x + cardW - cardR, y);
    shape.quadraticCurveTo(x + cardW, y, x + cardW, y + cardR);
    shape.lineTo(x + cardW, y + cardH - cardR);
    shape.quadraticCurveTo(x + cardW, y + cardH, x + cardW - cardR, y + cardH);
    shape.lineTo(x + cardR, y + cardH);
    shape.quadraticCurveTo(x, y + cardH, x, y + cardH - cardR);
    shape.lineTo(x, y + cardR);
    shape.quadraticCurveTo(x, y, x + cardR, y);

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth: cardDepth,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    extrudeGeo.center();

    // Shift geometry down so top edge sits cleanly below clasp
    const cardOffsetY = -cardH / 2 - 0.34;
    extrudeGeo.translate(0, cardOffsetY, 0);

    const rimMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(THEME.border2),
      metalness: 0.55,
      roughness: 0.35,
    });
    const cardBodyMesh = new THREE.Mesh(extrudeGeo, rimMat);
    badgeGroup.add(cardBodyMesh);

    // Front & Back Face Planes (mapped cleanly to UV 0..1)
    const faceShape = new THREE.Shape();
    const fx = -cardW / 2;
    const fy = -cardH / 2;
    faceShape.moveTo(fx + cardR, fy);
    faceShape.lineTo(fx + cardW - cardR, fy);
    faceShape.quadraticCurveTo(fx + cardW, fy, fx + cardW, fy + cardR);
    faceShape.lineTo(fx + cardW, fy + cardH - cardR);
    faceShape.quadraticCurveTo(fx + cardW, fy + cardH, fx + cardW - cardR, fy + cardH);
    faceShape.lineTo(fx + cardR, fy + cardH);
    faceShape.quadraticCurveTo(fx, fy + cardH, fx, fy + cardH - cardR);
    faceShape.lineTo(fx, fy + cardR);
    faceShape.quadraticCurveTo(fx, fy, fx + cardR, fy);

    const faceGeo = new THREE.ShapeGeometry(faceShape, 24);
    const posAttr = faceGeo.attributes.position;
    const uvAttr = faceGeo.attributes.uv;
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      uvAttr.setXY(i, (px + cardW / 2) / cardW, (py + cardH / 2) / cardH);
    }

    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTex,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
    });
    const frontMesh = new THREE.Mesh(faceGeo, frontMat);
    frontMesh.position.set(0, cardOffsetY, cardDepth / 2 + 0.013);
    badgeGroup.add(frontMesh);

    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTex,
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.5,
      clearcoatRoughness: 0.22,
    });
    const backMesh = new THREE.Mesh(faceGeo, backMat);
    backMesh.rotation.y = Math.PI;
    backMesh.position.set(0, cardOffsetY, -(cardDepth / 2 + 0.013));
    badgeGroup.add(backMesh);

    // Metallic Swivel Clasp Hardware
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xb8cce0,
      metalness: 0.88,
      roughness: 0.22,
    });

    const ringGeo = new THREE.TorusGeometry(0.11, 0.022, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, metalMat);
    ringMesh.position.set(0, -0.26, 0);
    badgeGroup.add(ringMesh);

    const barrelGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.18, 20);
    const barrelMesh = new THREE.Mesh(barrelGeo, metalMat);
    barrelMesh.position.set(0, -0.11, 0);
    badgeGroup.add(barrelMesh);

    const buckleGeo = new THREE.BoxGeometry(0.32, 0.11, 0.07);
    const buckleMesh = new THREE.Mesh(buckleGeo, metalMat);
    buckleMesh.position.set(0, 0.01, 0);
    badgeGroup.add(buckleMesh);

    // Dynamic Flexible Lanyard Strap Mesh
    const strapSegments = 24;
    const strapWidth = 0.28;
    const strapGeo = new THREE.PlaneGeometry(strapWidth, 1, 2, strapSegments);
    const strapMat = new THREE.MeshStandardMaterial({
      map: lanyardTex,
      roughness: 0.72,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    // The strap vertices move outside the original plane bounds.
    strapMesh.frustumCulled = false;
    scene.add(strapMesh);

    // Physics State
    const anchorPos = new THREE.Vector3();
    const updateAnchor = () => {
      // Extend beyond the visible top at the strap's depth, including its sag.
      const distance = camera.position.z + 0.5;
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
      anchorPos.set(0, Math.max(3.15, camera.position.y + halfHeight + 0.5), 0);
    };
    updateAnchor();
    const restPos = new THREE.Vector3(0, 1.35, 0);
    const pos = restPos.clone();
    const vel = new THREE.Vector3(0, 0, 0);

    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;
    let velRotX = 0;
    let velRotY = 0;
    let velRotZ = 0;
    let targetFlipY = 0;

    // Interaction State
    let isDragging = false;
    let isHovered = false;
    const pointerNDC = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const dragOffset = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const hitPoint = new THREE.Vector3();

    const updatePointerNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects([cardBodyMesh, frontMesh, backMesh, buckleMesh], false);
      if (intersects.length > 0) {
        isDragging = true;
        renderer.domElement.style.cursor = 'grabbing';
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), pos);
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          dragOffset.copy(pos).sub(hitPoint);
        }
        vel.set(0, 0, 0);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);

      if (isDragging) {
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          const nextPos = hitPoint.clone().add(dragOffset);
          // Soft clamp reach
          nextPos.x = THREE.MathUtils.clamp(nextPos.x, -3.2, 3.2);
          nextPos.y = THREE.MathUtils.clamp(nextPos.y, -2.4, 2.5);
          vel.copy(nextPos).sub(pos).multiplyScalar(28);
          pos.copy(nextPos);
        }
        return;
      }

      const intersects = raycaster.intersectObjects([cardBodyMesh, frontMesh, backMesh], false);
      isHovered = intersects.length > 0;
      renderer.domElement.style.cursor = isHovered ? 'grab' : 'default';
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        renderer.domElement.style.cursor = isHovered ? 'grab' : 'default';
        // Impart subtle angular spin from release velocity
        velRotY += vel.x * 0.25;
        velRotX -= vel.y * 0.18;
      }
    };

    const onDoubleClick = (e: MouseEvent) => {
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);
      const intersects = raycaster.intersectObjects([cardBodyMesh, frontMesh, backMesh], false);
      if (intersects.length > 0) {
        targetFlipY += Math.PI;
        velRotZ += 1.4;
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    domElem.addEventListener('dblclick', onDoubleClick);

    // ResizeObserver so component fits any wrapper smoothly
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          updateAnchor();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Update curved lanyard geometry between ceiling anchor and clasp
    const updateStrapGeometry = () => {
      const posArr = strapGeo.attributes.position;
      const topPoint = anchorPos;
      const bottomPoint = new THREE.Vector3(pos.x, pos.y + 0.04, pos.z);

      // Control point creates natural fabric sag when moved
      const midPoint = topPoint.clone().lerp(bottomPoint, 0.5);
      const slack = Math.max(0, 1.8 - topPoint.distanceTo(bottomPoint));
      midPoint.z -= 0.12 + slack * 0.35;
      midPoint.x -= (bottomPoint.x - topPoint.x) * 0.15;

      const curve = new THREE.QuadraticBezierCurve3(topPoint, midPoint, bottomPoint);
      const tangent = new THREE.Vector3();
      const right = new THREE.Vector3();

      for (let i = 0; i <= strapSegments; i++) {
        const t = i / strapSegments;
        const pt = curve.getPoint(t);
        curve.getTangent(t, tangent);

        // Twist strap gradually to match badge Y rotation near the clasp
        const twistAngle = rotY * Math.pow(t, 1.6);
        right.set(Math.cos(twistAngle), 0, -Math.sin(twistAngle)).multiplyScalar(strapWidth / 2);

        const leftIdx = i * 3;
        const centerIdx = i * 3 + 1;
        const rightIdx = i * 3 + 2;

        posArr.setXYZ(leftIdx, pt.x - right.x, pt.y, pt.z - right.z);
        posArr.setXYZ(centerIdx, pt.x, pt.y, pt.z);
        posArr.setXYZ(rightIdx, pt.x + right.x, pt.y, pt.z + right.z);
      }
      posArr.needsUpdate = true;
      strapGeo.computeVertexNormals();
    };

    // Animation Loop
    let animationFrameId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      // Spring-pendulum physics when not dragging
      if (!isDragging) {
        const stiffness = 68;
        const damping = 5.4;

        // Subtle ambient air current sway
        const breezeX = Math.sin(now * 0.0011) * 0.035;
        const breezeZ = Math.cos(now * 0.0009) * 0.02;

        const forceX = (restPos.x + breezeX - pos.x) * stiffness;
        const forceY = (restPos.y - pos.y) * (stiffness * 1.3);
        const forceZ = (restPos.z + breezeZ - pos.z) * stiffness;

        vel.x = (vel.x + forceX * dt) * Math.exp(-damping * dt);
        vel.y = (vel.y + forceY * dt) * Math.exp(-damping * dt);
        vel.z = (vel.z + forceZ * dt) * Math.exp(-damping * dt);

        pos.addScaledVector(vel, dt);
      }

      // Pendulum roll (Z) & pitch (X) driven by lateral/depth acceleration
      const targetRotZ = THREE.MathUtils.clamp(-(pos.x - anchorPos.x) * 0.36 - vel.x * 0.05, -0.65, 0.65);
      const hoverTiltX = isHovered && !isDragging ? -pointerNDC.y * 0.22 : 0;
      const hoverTiltY = isHovered && !isDragging ? pointerNDC.x * 0.32 : 0;

      const targetRotX = THREE.MathUtils.clamp(vel.z * 0.08 + hoverTiltX, -0.5, 0.5);
      const desiredRotY = targetFlipY + hoverTiltY + Math.sin(now * 0.0008) * 0.06;

      velRotX = (velRotX + (targetRotX - rotX) * 85 * dt) * Math.exp(-8 * dt);
      velRotY = (velRotY + (desiredRotY - rotY) * 65 * dt) * Math.exp(-6.5 * dt);
      velRotZ = (velRotZ + (targetRotZ - rotZ) * 85 * dt) * Math.exp(-7.5 * dt);

      rotX += velRotX * dt;
      rotY += velRotY * dt;
      rotZ += velRotZ * dt;

      badgeGroup.position.copy(pos);
      badgeGroup.rotation.set(rotX, rotY, rotZ);

      // Subtle dynamic shimmer on clearcoat based on card angle
      frontMat.clearcoatRoughness = 0.14 + Math.abs(Math.sin(rotY)) * 0.12;

      updateStrapGeometry();
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      domElem.removeEventListener('dblclick', onDoubleClick);

      frontTex.dispose();
      backTex.dispose();
      lanyardTex.dispose();
      extrudeGeo.dispose();
      faceGeo.dispose();
      ringGeo.dispose();
      barrelGeo.dispose();
      buckleGeo.dispose();
      strapGeo.dispose();
      rimMat.dispose();
      frontMat.dispose();
      backMat.dispose();
      metalMat.dispose();
      strapMat.dispose();
      renderer.dispose();
      if (domElem.parentNode === container) {
        container.removeChild(domElem);
      }
    };
  }, [name, role, idNumber, clearance, organization, department, zone, issuedDate]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '480px',
        position: 'relative',
        userSelect: 'none',
        touchAction: 'none',
        ...style,
      }}
      title="Drag to swing • Double-click to flip"
    />
  );
}