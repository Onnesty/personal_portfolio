import { useEffect, useRef, type CSSProperties } from 'react';
import * as Three from 'three';

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

function getCanvasContext(Canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const Context = Canvas.getContext('2d');
    if (!Context) throw new Error('A 2D canvas context is required to render the badge.');
    return Context;
}

// Badge colors live beside the page palettes in themes.css.
function GetBadgeTheme() {
    const Root = document.documentElement;
    const Styles = getComputedStyle(Root);
    const Color = (Name: string) => Styles.getPropertyValue(`--badge-${Name}`).trim();
    return {
        isLight: Root.dataset.theme === 'light',
        bg: Color('background'),
        bg2: Color('background-2'),
        bg3: Color('background-3'),
        bg4: Color('background-4'),
        text: Color('text'),
        muted: Color('muted'),
        sky: Color('accent'),
        sky2: Color('accent-2'),
        border: Color('border'),
        border2: Color('border-2'),
        titleFont: "'Outfit', sans-serif",
        textFont: "'Onest', sans-serif",
    };
}

function createRoundedRectPath(Ctx: CanvasRenderingContext2D, X: number, Y: number, Width: number, Height: number, Radius: number): void {
    Ctx.beginPath();
    Ctx.moveTo(X + Radius, Y);
    Ctx.lineTo(X + Width - Radius, Y);
    Ctx.quadraticCurveTo(X + Width, Y, X + Width, Y + Radius);
    Ctx.lineTo(X + Width, Y + Height - Radius);
    Ctx.quadraticCurveTo(X + Width, Y + Height, X + Width - Radius, Y + Height);
    Ctx.lineTo(X + Radius, Y + Height);
    Ctx.quadraticCurveTo(X, Y + Height, X, Y + Height - Radius);
    Ctx.lineTo(X, Y + Radius);
    Ctx.quadraticCurveTo(X, Y, X + Radius, Y);
    Ctx.closePath();
}

function generateCardTextures(Data: BadgeData) {
    const Theme = GetBadgeTheme();
    const Width = 1024;
    const Height = 1600;
    const Radius = 64;

    // --- FRONT CANVAS ---
    const FrontCanvas = document.createElement('canvas');
    FrontCanvas.width = Width;
    FrontCanvas.height = Height;
    const Ctx = getCanvasContext(FrontCanvas);

    Ctx.save();
    createRoundedRectPath(Ctx, 0, 0, Width, Height, Radius);
    Ctx.clip();

    // Base gradient using --background-2 and --background
    const BgGrad = Ctx.createLinearGradient(0, 0, Width, Height);
    BgGrad.addColorStop(0, Theme.bg2);
    BgGrad.addColorStop(0.55, Theme.bg);
    BgGrad.addColorStop(1, Theme.bg3);
    Ctx.fillStyle = BgGrad;
    Ctx.fillRect(0, 0, Width, Height);

    // Subtle architectural grid
    Ctx.strokeStyle = 'rgba(74, 158, 232, 0.06)';
    Ctx.lineWidth = 2;
    for (let Gx = 0;Gx < Width;Gx += 64) {
        Ctx.beginPath();
        Ctx.moveTo(Gx, 0);
        Ctx.lineTo(Gx, Height);
        Ctx.stroke();
    }
    for (let Gy = 0;Gy < Height;Gy += 64) {
        Ctx.beginPath();
        Ctx.moveTo(0, Gy);
        Ctx.lineTo(Width, Gy);
        Ctx.stroke();
    }

    // Top atmospheric sky glow
    const Glow = Ctx.createRadialGradient(Width * 0.5, 140, 20, Width * 0.5, 140, 620);
    Glow.addColorStop(0, 'rgba(74, 158, 232, 0.24)');
    Glow.addColorStop(0.5, 'rgba(126, 200, 240, 0.08)');
    Glow.addColorStop(1, 'rgba(15, 19, 25, 0)');
    Ctx.fillStyle = Glow;
    Ctx.fillRect(0, 0, Width, 750);

    // Lanyard slot cutout indicator
    Ctx.fillStyle = '#090c10';
    createRoundedRectPath(Ctx, Width / 2 - 90, 46, 180, 32, 16);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border2;
    Ctx.lineWidth = 3;
    Ctx.stroke();

    // Header brand & status pill
    Ctx.fillStyle = Theme.sky2;
    Ctx.font = `700 26px ${Theme.titleFont}`;
    Ctx.letterSpacing = '4px';
    Ctx.fillText(Data.organization.toUpperCase(), 72, 155);
    Ctx.letterSpacing = '0px';

    // Active status badge
    Ctx.fillStyle = Theme.bg4;
    createRoundedRectPath(Ctx, Width - 290, 122, 218, 46, 23);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border2;
    Ctx.lineWidth = 2;
    Ctx.stroke();

    Ctx.fillStyle = Theme.sky;
    Ctx.beginPath();
    Ctx.arc(Width - 258, 145, 7, 0, Math.PI * 2);
    Ctx.fill();

    Ctx.fillStyle = Theme.text;
    Ctx.font = `600 20px ${Theme.textFont}`;
    Ctx.fillText(Data.clearance.toUpperCase(), Width - 238, 152);

    // Avatar frame (--background-3 & --border-2)
    const AvatarX = 72;
    const AvatarY = 225;
    const AvatarSize = 340;

    Ctx.fillStyle = Theme.bg3;
    createRoundedRectPath(Ctx, AvatarX, AvatarY, AvatarSize, AvatarSize, 36);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border2;
    Ctx.lineWidth = 3;
    Ctx.stroke();

    // Stylized geometric silhouette inside avatar
    Ctx.save();
    createRoundedRectPath(Ctx, AvatarX, AvatarY, AvatarSize, AvatarSize, 36);
    Ctx.clip();

    const AvGrad = Ctx.createLinearGradient(AvatarX, AvatarY, AvatarX + AvatarSize, AvatarY + AvatarSize);
    AvGrad.addColorStop(0, Theme.bg4);
    AvGrad.addColorStop(1, Theme.bg);
    Ctx.fillStyle = AvGrad;
    Ctx.fillRect(AvatarX, AvatarY, AvatarSize, AvatarSize);

    // Accent ring
    Ctx.strokeStyle = 'rgba(126, 200, 240, 0.25)';
    Ctx.lineWidth = 2;
    Ctx.beginPath();
    Ctx.arc(AvatarX + AvatarSize / 2, AvatarY + AvatarSize / 2, 125, 0, Math.PI * 2);
    Ctx.stroke();

    // Head & shoulders vector
    Ctx.fillStyle = Theme.sky;
    Ctx.beginPath();
    Ctx.arc(AvatarX + AvatarSize / 2, AvatarY + 135, 54, 0, Math.PI * 2);
    Ctx.fill();

    Ctx.fillStyle = Theme.sky2;
    Ctx.beginPath();
    Ctx.arc(AvatarX + AvatarSize / 2, AvatarY + 325, 118, Math.PI, 0);
    Ctx.fill();
    Ctx.restore();

    // Metallic EMV Smart Chip beside avatar
    const ChipX = 465;
    const ChipY = 245;
    const ChipW = 124;
    const ChipH = 96;
    const ChipGrad = Ctx.createLinearGradient(ChipX, ChipY, ChipX + ChipW, ChipY + ChipH);
    ChipGrad.addColorStop(0, Theme.sky2);
    ChipGrad.addColorStop(0.5, Theme.sky);
    ChipGrad.addColorStop(1, '#2b6cb0');
    Ctx.fillStyle = ChipGrad;
    createRoundedRectPath(Ctx, ChipX, ChipY, ChipW, ChipH, 16);
    Ctx.fill();

    Ctx.strokeStyle = 'rgba(15, 19, 25, 0.45)';
    Ctx.lineWidth = 2.5;
    Ctx.beginPath();
    Ctx.moveTo(ChipX + 42, ChipY);
    Ctx.lineTo(ChipX + 42, ChipY + ChipH);
    Ctx.moveTo(ChipX + 82, ChipY);
    Ctx.lineTo(ChipX + 82, ChipY + ChipH);
    Ctx.moveTo(ChipX, ChipY + 32);
    Ctx.lineTo(ChipX + ChipW, ChipY + 32);
    Ctx.moveTo(ChipX, ChipY + 64);
    Ctx.lineTo(ChipX + ChipW, ChipY + 64);
    Ctx.stroke();

    // Credential metadata right of avatar
    Ctx.fillStyle = Theme.muted;
    Ctx.font = `500 22px ${Theme.textFont}`;
    Ctx.fillText('CREDENTIAL ID', 465, 405);

    Ctx.fillStyle = Theme.sky2;
    Ctx.font = `700 34px ${Theme.titleFont}`;
    Ctx.fillText(Data.idNumber, 465, 448);

    Ctx.fillStyle = Theme.muted;
    Ctx.font = `500 22px ${Theme.textFont}`;
    Ctx.fillText('ISSUED', 465, 512);

    Ctx.fillStyle = Theme.text;
    Ctx.font = `600 28px ${Theme.textFont}`;
    Ctx.fillText(Data.issuedDate, 465, 550);

    // Divider line
    Ctx.strokeStyle = Theme.border;
    Ctx.lineWidth = 2;
    Ctx.beginPath();
    Ctx.moveTo(72, 635);
    Ctx.lineTo(Width - 72, 635);
    Ctx.stroke();

    // Holder Name & Title
    Ctx.fillStyle = Theme.text;
    Ctx.font = `700 76px ${Theme.titleFont}`;
    Ctx.fillText(Data.name, 72, 745);

    Ctx.fillStyle = Theme.sky;
    Ctx.font = `500 36px ${Theme.textFont}`;
    Ctx.fillText(Data.role, 72, 808);

    // Info Cards Grid
    const BoxY = 885;
    const BoxH = 155;
    const BoxW = (Width - 144 - 28) / 2;

    // Box 1: Department
    Ctx.fillStyle = Theme.bg3;
    createRoundedRectPath(Ctx, 72, BoxY, BoxW, BoxH, 24);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border;
    Ctx.lineWidth = 2;
    Ctx.stroke();

    Ctx.fillStyle = Theme.muted;
    Ctx.font = `500 22px ${Theme.textFont}`;
    Ctx.fillText('DEPARTMENT', 102, BoxY + 52);

    Ctx.fillStyle = Theme.text;
    Ctx.font = `600 32px ${Theme.titleFont}`;
    Ctx.fillText(Data.department, 102, BoxY + 106);

    // Box 2: Access Zone
    Ctx.fillStyle = Theme.bg3;
    createRoundedRectPath(Ctx, 72 + BoxW + 28, BoxY, BoxW, BoxH, 24);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border;
    Ctx.lineWidth = 2;
    Ctx.stroke();

    Ctx.fillStyle = Theme.muted;
    Ctx.font = `500 22px ${Theme.textFont}`;
    Ctx.fillText('ACCESS ZONE', 102 + BoxW + 28, BoxY + 52);

    Ctx.fillStyle = Theme.sky2;
    Ctx.font = `600 32px ${Theme.titleFont}`;
    Ctx.fillText(Data.zone, 102 + BoxW + 28, BoxY + 106);

    // Bottom Barcode & Verification Footer
    const FooterY = 1120;
    Ctx.fillStyle = Theme.bg2;
    createRoundedRectPath(Ctx, 72, FooterY, Width - 144, 390, 28);
    Ctx.fill();
    Ctx.strokeStyle = Theme.border2;
    Ctx.lineWidth = 2;
    Ctx.stroke();

    // Procedural crisp barcode
    const BarStartX = 116;
    const BarY = FooterY + 54;
    const BarH = 140;
    let CursorX = BarStartX;
    const Pattern = [4, 2, 8, 3, 2, 6, 4, 2, 10, 2, 4, 6, 2, 3, 8, 2, 4, 2, 6, 4, 8, 2, 3, 4, 6, 2, 8, 4, 2, 6, 3, 4, 8, 2];
    Pattern.forEach((W, Idx) => {
        if (Idx % 2 === 0) {
            Ctx.fillStyle = Idx % 4 === 0 ? Theme.text : Theme.sky2;
            Ctx.fillRect(CursorX, BarY, W * 4.2, BarH);
        }
        CursorX += W * 4.8;
    });

    // Serial hash text under barcode
    Ctx.fillStyle = Theme.muted;
    Ctx.font = `500 24px monospace`;
    Ctx.fillText(`SHA256 // ${Data.idNumber}-VERIFIED-2026`, 116, BarY + BarH + 52);

    // Bottom security micro-strip
    Ctx.fillStyle = Theme.sky;
    Ctx.fillRect(116, FooterY + 305, 140, 8);
    Ctx.fillStyle = Theme.border2;
    Ctx.fillRect(272, FooterY + 305, Width - 388, 8);

    // Inner card border rim
    Ctx.strokeStyle = Theme.border2;
    Ctx.lineWidth = 6;
    createRoundedRectPath(Ctx, 3, 3, Width - 6, Height - 6, Radius);
    Ctx.stroke();
    Ctx.restore();

    // --- BACK CANVAS ---
    const BackCanvas = document.createElement('canvas');
    BackCanvas.width = Width;
    BackCanvas.height = Height;
    const Bctx = getCanvasContext(BackCanvas);

    Bctx.save();
    createRoundedRectPath(Bctx, 0, 0, Width, Height, Radius);
    Bctx.clip();

    Bctx.fillStyle = Theme.bg;
    Bctx.fillRect(0, 0, Width, Height);

    // Lanyard slot cutout
    Bctx.fillStyle = '#090c10';
    createRoundedRectPath(Bctx, Width / 2 - 90, 46, 180, 32, 16);
    Bctx.fill();
    Bctx.strokeStyle = Theme.border2;
    Bctx.lineWidth = 3;
    Bctx.stroke();

    // Magnetic Stripe
    const MagGrad = Bctx.createLinearGradient(0, 140, Width, 280);
    MagGrad.addColorStop(0, '#070a0e');
    MagGrad.addColorStop(0.5, Theme.bg3);
    MagGrad.addColorStop(1, '#070a0e');
    Bctx.fillStyle = MagGrad;
    Bctx.fillRect(0, 145, Width, 135);

    Bctx.strokeStyle = Theme.border;
    Bctx.lineWidth = 2;
    Bctx.beginPath();
    Bctx.moveTo(0, 145);
    Bctx.lineTo(Width, 145);
    Bctx.moveTo(0, 280);
    Bctx.lineTo(Width, 280);
    Bctx.stroke();

    // Signature Strip
    Bctx.fillStyle = Theme.muted;
    Bctx.font = `600 22px ${Theme.textFont}`;
    Bctx.fillText('AUTHORIZED SIGNATURE', 72, 365);

    Bctx.fillStyle = Theme.bg3;
    createRoundedRectPath(Bctx, 72, 390, Width - 144, 115, 18);
    Bctx.fill();
    Bctx.strokeStyle = Theme.border2;
    Bctx.lineWidth = 2;
    Bctx.stroke();

    // Cursive-style vector signature
    Bctx.strokeStyle = Theme.sky2;
    Bctx.lineWidth = 4;
    Bctx.beginPath();
    Bctx.moveTo(120, 465);
    Bctx.bezierCurveTo(170, 395, 210, 490, 265, 435);
    Bctx.bezierCurveTo(310, 390, 340, 480, 415, 440);
    Bctx.bezierCurveTo(465, 415, 510, 465, 595, 445);
    Bctx.stroke();

    // Security Policy Terms
    Bctx.fillStyle = Theme.text;
    Bctx.font = `700 30px ${Theme.titleFont}`;
    Bctx.fillText('SECURITY & ACCESS PROTOCOL', 72, 600);

    const Terms = [
        '1. This credential remains the property of the issuing organization.',
        '2. Must be worn visibly at all times within restricted facilities.',
        '3. Unauthorized duplication, transfer, or alteration is prohibited.',
        '4. Report lost or compromised credentials immediately to security.',
    ];

    Bctx.fillStyle = Theme.muted;
    Bctx.font = `400 25px ${Theme.textFont}`;
    Terms.forEach((Line, I) => {
        Bctx.fillText(Line, 72, 665 + I * 54);
    });

    // Procedural Matrix / QR Block
    const QrSize = 240;
    const QrX = 72;
    const QrY = 940;
    Bctx.fillStyle = Theme.bg2;
    createRoundedRectPath(Bctx, QrX, QrY, QrSize, QrSize, 24);
    Bctx.fill();
    Bctx.strokeStyle = Theme.border2;
    Bctx.lineWidth = 2;
    Bctx.stroke();

    const Cells = 9;
    const CellSize = (QrSize - 48) / Cells;
    for (let R = 0;R < Cells;R++) {
        for (let C = 0;C < Cells;C++) {
            if ((R * 7 + C * 13) % 3 === 0 || (R < 2 && C < 2) || (R > 6 && C > 6)) {
                Bctx.fillStyle = (R + C) % 2 === 0 ? Theme.sky : Theme.text;
                Bctx.fillRect(QrX + 24 + C * CellSize, QrY + 24 + R * CellSize, CellSize - 3, CellSize - 3);
            }
        }
    }

    // Emergency / Return Contact Info next to QR
    Bctx.fillStyle = Theme.sky2;
    Bctx.font = `700 26px ${Theme.titleFont}`;
    Bctx.fillText('ENCRYPTED NFC ENABLED', 350, 995);

    Bctx.fillStyle = Theme.muted;
    Bctx.font = `400 24px ${Theme.textFont}`;
    Bctx.fillText('Tap badge against any Level-3', 350, 1045);
    Bctx.fillText('biometric reader for instant auth.', 350, 1082);

    Bctx.fillStyle = Theme.sky;
    Bctx.font = `600 24px ${Theme.textFont}`;
    Bctx.fillText(`ID: ${Data.idNumber}`, 350, 1145);

    // Bottom wordmark
    Bctx.fillStyle = Theme.muted;
    Bctx.font = `700 24px ${Theme.titleFont}`;
    Bctx.fillText(`${Data.organization.toUpperCase()} // ACCESS CONTROL`, 72, 1485);

    Bctx.strokeStyle = Theme.border2;
    Bctx.lineWidth = 6;
    createRoundedRectPath(Bctx, 3, 3, Width - 6, Height - 6, Radius);
    Bctx.stroke();
    Bctx.restore();

    const FrontTex = new Three.CanvasTexture(FrontCanvas);
    FrontTex.colorSpace = Three.SRGBColorSpace;
    FrontTex.anisotropy = 8;

    const BackTex = new Three.CanvasTexture(BackCanvas);
    BackTex.colorSpace = Three.SRGBColorSpace;
    BackTex.anisotropy = 8;

    return { frontTex: FrontTex, backTex: BackTex };
}

function generateLanyardTexture() {
    const Theme = GetBadgeTheme();
    const Canvas = document.createElement('canvas');
    Canvas.width = 256;
    Canvas.height = 1024;
    const Ctx = getCanvasContext(Canvas);

    // Woven strap base (--background-4)
    Ctx.fillStyle = Theme.bg4;
    Ctx.fillRect(0, 0, 256, 1024);

    // Subtle diagonal nylon weave
    Ctx.strokeStyle = 'rgba(228, 238, 248, 0.05)';
    Ctx.lineWidth = 2;
    for (let Y = -256;Y < 1280;Y += 10) {
        Ctx.beginPath();
        Ctx.moveTo(0, Y);
        Ctx.lineTo(256, Y + 128);
        Ctx.stroke();
    }

    // Sky accent edge stitching
    Ctx.fillStyle = Theme.sky;
    Ctx.fillRect(14, 0, 6, 1024);
    Ctx.fillRect(236, 0, 6, 1024);

    // Center subtle stripe
    Ctx.fillStyle = 'rgba(126, 200, 240, 0.16)';
    Ctx.fillRect(118, 0, 20, 1024);

    const Tex = new Three.CanvasTexture(Canvas);
    Tex.colorSpace = Three.SRGBColorSpace;
    Tex.wrapS = Three.RepeatWrapping;
    Tex.wrapT = Three.RepeatWrapping;
    Tex.repeat.set(1, 3);
    return Tex;
}

export default function HangingIdBadge({
    name: Name = 'ELENA ROSTOVA',
    role: Role = 'Principal Systems Architect',
    idNumber: IdNumber = 'NX-8842-90',
    clearance: Clearance = 'LEVEL 04',
    organization: Organization = 'AETHER DYNAMICS',
    department: Department = 'Core Infrastructure',
    zone: Zone = 'SECTOR 7G',
    issuedDate: IssuedDate = 'NOV 2026',
    className: ClassName = '',
    style: Style = {},
}: HangingIdBadgeProps = {}) {
    const ContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const Container = ContainerRef.current;
        if (!Container) return;
        const Theme = GetBadgeTheme();

        const Width = Container.clientWidth || 500;
        const Height = Container.clientHeight || 650;

        // Scene & Transparent Renderer
        const Scene = new Three.Scene();
        const Camera = new Three.PerspectiveCamera(36, Width / Height, 0.1, 100);
        Camera.position.set(0, -0.35, 8.2);

        const Renderer = new Three.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        Renderer.setSize(Width, Height);
        Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        Renderer.toneMapping = Three.ACESFilmicToneMapping;
        Renderer.toneMappingExposure = 1.15;
        Container.appendChild(Renderer.domElement);

        // Studio Lighting tailored to --sky and --sky-2
        const AmbientLight = new Three.AmbientLight(0xe4eef8, 0.9);
        Scene.add(AmbientLight);

        const KeyLight = new Three.DirectionalLight(0xffffff, 1.8);
        KeyLight.position.set(4, 6, 7);
        Scene.add(KeyLight);

        const SkyRimLight = new Three.PointLight(0x4a9ee8, 4.5, 18);
        SkyRimLight.position.set(-4.5, 2.5, 4);
        Scene.add(SkyRimLight);

        const IceRimLight = new Three.PointLight(0x7ec8f0, 3.2, 16);
        IceRimLight.position.set(4.5, -3.5, 3.5);
        Scene.add(IceRimLight);

        // Textures
        let { frontTex: FrontTex, backTex: BackTex } = generateCardTextures({
            name: Name,
            role: Role,
            idNumber: IdNumber,
            clearance: Clearance,
            organization: Organization,
            department: Department,
            zone: Zone,
            issuedDate: IssuedDate,
        });
        let LanyardTex = generateLanyardTexture();

        // Badge Pivot Group (origin at top clasp attachment point)
        const BadgeGroup = new Three.Group();
        Scene.add(BadgeGroup);

        // Rounded Card Extruded Geometry
        const CardW = 2.24;
        const CardH = 3.5;
        const CardR = 0.14;
        const CardDepth = 0.045;

        const Shape = new Three.Shape();
        const X = -CardW / 2;
        const Y = -CardH;
        Shape.moveTo(X + CardR, Y);
        Shape.lineTo(X + CardW - CardR, Y);
        Shape.quadraticCurveTo(X + CardW, Y, X + CardW, Y + CardR);
        Shape.lineTo(X + CardW, Y + CardH - CardR);
        Shape.quadraticCurveTo(X + CardW, Y + CardH, X + CardW - CardR, Y + CardH);
        Shape.lineTo(X + CardR, Y + CardH);
        Shape.quadraticCurveTo(X, Y + CardH, X, Y + CardH - CardR);
        Shape.lineTo(X, Y + CardR);
        Shape.quadraticCurveTo(X, Y, X + CardR, Y);

        const ExtrudeGeo = new Three.ExtrudeGeometry(Shape, {
            depth: CardDepth,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.012,
            bevelThickness: 0.012,
        });
        ExtrudeGeo.center();

        // Shift geometry down so top edge sits cleanly below clasp
        const CardOffsetY = -CardH / 2 - 0.34;
        ExtrudeGeo.translate(0, CardOffsetY, 0);

        const RimMat = new Three.MeshStandardMaterial({
            color: new Three.Color(Theme.border2),
            metalness: 0.55,
            roughness: 0.35,
        });
        const CardBodyMesh = new Three.Mesh(ExtrudeGeo, RimMat);
        BadgeGroup.add(CardBodyMesh);

        // Front & Back Face Planes (mapped cleanly to UV 0..1)
        const FaceShape = new Three.Shape();
        const Fx = -CardW / 2;
        const Fy = -CardH / 2;
        FaceShape.moveTo(Fx + CardR, Fy);
        FaceShape.lineTo(Fx + CardW - CardR, Fy);
        FaceShape.quadraticCurveTo(Fx + CardW, Fy, Fx + CardW, Fy + CardR);
        FaceShape.lineTo(Fx + CardW, Fy + CardH - CardR);
        FaceShape.quadraticCurveTo(Fx + CardW, Fy + CardH, Fx + CardW - CardR, Fy + CardH);
        FaceShape.lineTo(Fx + CardR, Fy + CardH);
        FaceShape.quadraticCurveTo(Fx, Fy + CardH, Fx, Fy + CardH - CardR);
        FaceShape.lineTo(Fx, Fy + CardR);
        FaceShape.quadraticCurveTo(Fx, Fy, Fx + CardR, Fy);

        const FaceGeo = new Three.ShapeGeometry(FaceShape, 24);
        const PosAttr = FaceGeo.attributes.position;
        const UvAttr = FaceGeo.attributes.uv;
        for (let I = 0;I < PosAttr.count;I++) {
            const Px = PosAttr.getX(I);
            const Py = PosAttr.getY(I);
            UvAttr.setXY(I, (Px + CardW / 2) / CardW, (Py + CardH / 2) / CardH);
        }

        const FrontMat = new Three.MeshPhysicalMaterial({
            map: FrontTex,
            roughness: 0.28,
            metalness: 0.08,
            clearcoat: 0.65,
            clearcoatRoughness: 0.18,
        });
        // Keep the light-mode artwork white at every angle.
        const LightFrontMat = new Three.MeshBasicMaterial({ map: FrontTex, toneMapped: false });
        const FrontMesh = new Three.Mesh(FaceGeo, Theme.isLight ? LightFrontMat : FrontMat);
        FrontMesh.position.set(0, CardOffsetY, CardDepth / 2 + 0.013);
        BadgeGroup.add(FrontMesh);

        const BackMat = new Three.MeshPhysicalMaterial({
            map: BackTex,
            roughness: 0.32,
            metalness: 0.08,
            clearcoat: 0.5,
            clearcoatRoughness: 0.22,
        });
        const LightBackMat = new Three.MeshBasicMaterial({ map: BackTex, toneMapped: false });
        const BackMesh = new Three.Mesh(FaceGeo, Theme.isLight ? LightBackMat : BackMat);
        BackMesh.rotation.y = Math.PI;
        BackMesh.position.set(0, CardOffsetY, -(CardDepth / 2 + 0.013));
        BadgeGroup.add(BackMesh);

        // Metallic Swivel Clasp Hardware
        const MetalMat = new Three.MeshStandardMaterial({
            color: 0xb8cce0,
            metalness: 0.88,
            roughness: 0.22,
        });

        const RingGeo = new Three.TorusGeometry(0.11, 0.022, 16, 32);
        const RingMesh = new Three.Mesh(RingGeo, MetalMat);
        RingMesh.position.set(0, -0.26, 0);
        BadgeGroup.add(RingMesh);

        const BarrelGeo = new Three.CylinderGeometry(0.055, 0.065, 0.18, 20);
        const BarrelMesh = new Three.Mesh(BarrelGeo, MetalMat);
        BarrelMesh.position.set(0, -0.11, 0);
        BadgeGroup.add(BarrelMesh);

        const BuckleGeo = new Three.BoxGeometry(0.32, 0.11, 0.07);
        const BuckleMesh = new Three.Mesh(BuckleGeo, MetalMat);
        BuckleMesh.position.set(0, 0.01, 0);
        BadgeGroup.add(BuckleMesh);

        // Dynamic Flexible Lanyard Strap Mesh
        const StrapSegments = 24;
        const StrapWidth = 0.28;
        const StrapGeo = new Three.PlaneGeometry(StrapWidth, 1, 2, StrapSegments);
        const StrapMat = new Three.MeshStandardMaterial({
            map: LanyardTex,
            roughness: 0.72,
            metalness: 0.05,
            side: Three.DoubleSide,
        });
        // Refresh badge colors and materials without resetting the swing or drag state.
        const ThemeObserver = new MutationObserver(() => {
            const NextTheme = GetBadgeTheme();
            const Textures = generateCardTextures({
                name: Name, role: Role, idNumber: IdNumber, clearance: Clearance,
                organization: Organization, department: Department, zone: Zone, issuedDate: IssuedDate,
            });
            const NextLanyardTex = generateLanyardTexture();
            FrontMat.map = Textures.frontTex;
            BackMat.map = Textures.backTex;
            LightFrontMat.map = Textures.frontTex;
            LightBackMat.map = Textures.backTex;
            FrontMesh.material = NextTheme.isLight ? LightFrontMat : FrontMat;
            BackMesh.material = NextTheme.isLight ? LightBackMat : BackMat;
            StrapMat.map = NextLanyardTex;
            RimMat.color.set(NextTheme.border2);
            FrontTex.dispose();
            BackTex.dispose();
            LanyardTex.dispose();
            FrontTex = Textures.frontTex;
            BackTex = Textures.backTex;
            LanyardTex = NextLanyardTex;
        });
        ThemeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        const StrapMesh = new Three.Mesh(StrapGeo, StrapMat);
        // The strap vertices move outside the original plane bounds.
        StrapMesh.frustumCulled = false;
        Scene.add(StrapMesh);

        // Physics State
        const AnchorPos = new Three.Vector3();
        const UpdateAnchor = () => {
            // Extend beyond the visible top at the strap's depth, including its sag.
            const Distance = Camera.position.z + 0.5;
            const HalfHeight = Math.tan(Three.MathUtils.degToRad(Camera.fov / 2)) * Distance;
            AnchorPos.set(0, Math.max(3.15, Camera.position.y + HalfHeight + 0.5), 0);
        };
        UpdateAnchor();
        const RestPos = new Three.Vector3(0, 1.35, 0);
        const Pos = RestPos.clone();
        const Vel = new Three.Vector3(0, 0, 0);
        let IsDropping = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (IsDropping) Pos.y = AnchorPos.y - 0.4;

        let RotX = 0;
        let RotY = 0;
        let RotZ = 0;
        let VelRotX = 0;
        let VelRotY = 0;
        let VelRotZ = 0;
        let TargetFlipY = 0;

        // Interaction State
        let IsDragging = false;
        let ActivePointerId: number | null = null;
        let IsHovered = false;
        const PointerNDC = new Three.Vector2();
        const DragPlane = new Three.Plane(new Three.Vector3(0, 0, 1), 0);
        const DragOffset = new Three.Vector3();
        const Raycaster = new Three.Raycaster();
        const HitPoint = new Three.Vector3();

        const UpdatePointerNDC = (ClientX: number, ClientY: number) => {
            const Rect = Renderer.domElement.getBoundingClientRect();
            PointerNDC.x = ((ClientX - Rect.left) / Rect.width) * 2 - 1;
            PointerNDC.y = -((ClientY - Rect.top) / Rect.height) * 2 + 1;
        };

        const OnPointerDown = (E: PointerEvent) => {
            if (!E.isPrimary || E.button !== 0 || ActivePointerId !== null) return;
            UpdatePointerNDC(E.clientX, E.clientY);
            Raycaster.setFromCamera(PointerNDC, Camera);
            const Intersects = Raycaster.intersectObjects([CardBodyMesh, FrontMesh, BackMesh, BuckleMesh], false);
            if (Intersects.length > 0) {
                IsDragging = true;
                IsDropping = false;
                ActivePointerId = E.pointerId;
                Renderer.domElement.style.cursor = 'grabbing';
                DragPlane.setFromNormalAndCoplanarPoint(new Three.Vector3(0, 0, 1), Pos);
                if (Raycaster.ray.intersectPlane(DragPlane, HitPoint)) {
                    DragOffset.copy(Pos).sub(HitPoint);
                }
                Vel.set(0, 0, 0);
            }
        };

        const OnPointerMove = (E: PointerEvent) => {
            if (ActivePointerId !== null && E.pointerId !== ActivePointerId) return;
            if (E.pointerType === 'touch' && !IsDragging) return;
            UpdatePointerNDC(E.clientX, E.clientY);
            Raycaster.setFromCamera(PointerNDC, Camera);

            if (IsDragging) {
                if (Raycaster.ray.intersectPlane(DragPlane, HitPoint)) {
                    const NextPos = HitPoint.clone().add(DragOffset);
                    // Soft clamp reach
                    NextPos.x = Three.MathUtils.clamp(NextPos.x, -3.2, 3.2);
                    NextPos.y = Three.MathUtils.clamp(NextPos.y, -2.4, 2.5);
                    Vel.copy(NextPos).sub(Pos).multiplyScalar(28);
                    Pos.copy(NextPos);
                }
                return;
            }

            const Intersects = Raycaster.intersectObjects([CardBodyMesh, FrontMesh, BackMesh], false);
            IsHovered = Intersects.length > 0;
            Renderer.domElement.style.cursor = IsHovered ? 'grab' : 'default';
        };

        const OnPointerCancel = (E: PointerEvent) => {
            if (E.pointerId !== ActivePointerId) return;
            // A vertical swipe belongs to the browser; stop dragging without a fling.
            IsDragging = false;
            IsHovered = false;
            ActivePointerId = null;
            Vel.set(0, 0, 0);
            Renderer.domElement.style.cursor = 'default';
        };

        const OnPointerUp = (E: PointerEvent) => {
            if (E.pointerId !== ActivePointerId) return;
            ActivePointerId = null;
            if (E.pointerType === 'touch') IsHovered = false;
            if (IsDragging) {
                IsDragging = false;
                Renderer.domElement.style.cursor = IsHovered ? 'grab' : 'default';
                // Impart subtle angular spin from release velocity
                VelRotY += Vel.x * 0.25;
                VelRotX -= Vel.y * 0.18;
            }
        };

        const OnDoubleClick = (E: MouseEvent) => {
            UpdatePointerNDC(E.clientX, E.clientY);
            Raycaster.setFromCamera(PointerNDC, Camera);
            const Intersects = Raycaster.intersectObjects([CardBodyMesh, FrontMesh, BackMesh], false);
            if (Intersects.length > 0) {
                TargetFlipY += Math.PI;
                VelRotZ += 1.4;
            }
        };

        const DomElem = Renderer.domElement;
        DomElem.addEventListener('pointerdown', OnPointerDown);
        window.addEventListener('pointermove', OnPointerMove);
        window.addEventListener('pointerup', OnPointerUp);
        window.addEventListener('pointercancel', OnPointerCancel);
        DomElem.addEventListener('dblclick', OnDoubleClick);

        // ResizeObserver so component fits any wrapper smoothly
        const BadgeResizeObserver = new ResizeObserver((Entries) => {
            for (const Entry of Entries) {
                const { width: W, height: H } = Entry.contentRect;
                if (W > 0 && H > 0) {
                    Camera.aspect = W / H;
                    Camera.updateProjectionMatrix();
                    UpdateAnchor();
                    Renderer.setSize(W, H);
                }
            }
        });
        BadgeResizeObserver.observe(Container);

        // Update curved lanyard geometry between ceiling anchor and clasp
        const UpdateStrapGeometry = () => {
            const PosArr = StrapGeo.attributes.position;
            const TopPoint = AnchorPos;
            const BottomPoint = new Three.Vector3(Pos.x, Pos.y + 0.04, Pos.z);

            // Control point creates natural fabric sag when moved
            const MidPoint = TopPoint.clone().lerp(BottomPoint, 0.5);
            const Slack = Math.max(0, 1.8 - TopPoint.distanceTo(BottomPoint));
            MidPoint.z -= 0.12 + Slack * 0.35;
            MidPoint.x -= (BottomPoint.x - TopPoint.x) * 0.15;

            const Curve = new Three.QuadraticBezierCurve3(TopPoint, MidPoint, BottomPoint);
            const Tangent = new Three.Vector3();
            const Right = new Three.Vector3();

            for (let I = 0;I <= StrapSegments;I++) {
                const T = I / StrapSegments;
                const Pt = Curve.getPoint(T);
                Curve.getTangent(T, Tangent);

                // Twist strap gradually to match badge Y rotation near the clasp
                const TwistAngle = RotY * Math.pow(T, 1.6);
                Right.set(Math.cos(TwistAngle), 0, -Math.sin(TwistAngle)).multiplyScalar(StrapWidth / 2);

                const LeftIdx = I * 3;
                const CenterIdx = I * 3 + 1;
                const RightIdx = I * 3 + 2;

                PosArr.setXYZ(LeftIdx, Pt.x - Right.x, Pt.y, Pt.z - Right.z);
                PosArr.setXYZ(CenterIdx, Pt.x, Pt.y, Pt.z);
                PosArr.setXYZ(RightIdx, Pt.x + Right.x, Pt.y, Pt.z + Right.z);
            }
            PosArr.needsUpdate = true;
            StrapGeo.computeVertexNormals();
        };

        // Animation Loop
        let AnimationFrameId = 0;
        let LastTime = performance.now();

        const Animate = (Now: number) => {
            AnimationFrameId = requestAnimationFrame(Animate);
            const Dt = Math.min((Now - LastTime) / 1000, 0.033);
            LastTime = Now;

            if (IsDropping) {
                // Let the badge free-fall until the strap takes up the slack.
                const Gravity = 9.8;
                Pos.y += Vel.y * Dt - 0.5 * Gravity * Dt * Dt;
                Vel.y -= Gravity * Dt;
                if (Pos.y <= RestPos.y) IsDropping = false;
            } else if (!IsDragging) {
                const Stiffness = 68;
                const Damping = 5.4;

                // Subtle ambient air current sway
                const BreezeX = Math.sin(Now * 0.0011) * 0.035;
                const BreezeZ = Math.cos(Now * 0.0009) * 0.02;

                const ForceX = (RestPos.x + BreezeX - Pos.x) * Stiffness;
                const ForceY = (RestPos.y - Pos.y) * (Stiffness * 1.3);
                const ForceZ = (RestPos.z + BreezeZ - Pos.z) * Stiffness;

                Vel.x = (Vel.x + ForceX * Dt) * Math.exp(-Damping * Dt);
                Vel.y = (Vel.y + ForceY * Dt) * Math.exp(-Damping * Dt);
                Vel.z = (Vel.z + ForceZ * Dt) * Math.exp(-Damping * Dt);

                Pos.addScaledVector(Vel, Dt);
            }

            // Pendulum roll (Z) & pitch (X) driven by lateral/depth acceleration
            const TargetRotZ = Three.MathUtils.clamp(-(Pos.x - AnchorPos.x) * 0.36 - Vel.x * 0.05, -0.65, 0.65);
            const HoverTiltX = IsHovered && !IsDragging ? -PointerNDC.y * 0.22 : 0;
            const HoverTiltY = IsHovered && !IsDragging ? PointerNDC.x * 0.32 : 0;

            const TargetRotX = Three.MathUtils.clamp(Vel.z * 0.08 + HoverTiltX, -0.5, 0.5);
            const DesiredRotY = TargetFlipY + HoverTiltY + Math.sin(Now * 0.0008) * 0.06;

            VelRotX = (VelRotX + (TargetRotX - RotX) * 85 * Dt) * Math.exp(-8 * Dt);
            VelRotY = (VelRotY + (DesiredRotY - RotY) * 65 * Dt) * Math.exp(-6.5 * Dt);
            VelRotZ = (VelRotZ + (TargetRotZ - RotZ) * 85 * Dt) * Math.exp(-7.5 * Dt);

            RotX += VelRotX * Dt;
            RotY += VelRotY * Dt;
            RotZ += VelRotZ * Dt;

            BadgeGroup.position.copy(Pos);
            BadgeGroup.rotation.set(RotX, RotY, RotZ);

            // Subtle dynamic shimmer on clearcoat based on card angle
            FrontMat.clearcoatRoughness = 0.14 + Math.abs(Math.sin(RotY)) * 0.12;

            UpdateStrapGeometry();
            Renderer.render(Scene, Camera);
        };

        AnimationFrameId = requestAnimationFrame(Animate);

        // Cleanup on unmount
        return () => {
            cancelAnimationFrame(AnimationFrameId);
            BadgeResizeObserver.disconnect();
            ThemeObserver.disconnect();
            DomElem.removeEventListener('pointerdown', OnPointerDown);
            window.removeEventListener('pointermove', OnPointerMove);
            window.removeEventListener('pointerup', OnPointerUp);
            window.removeEventListener('pointercancel', OnPointerCancel);
            DomElem.removeEventListener('dblclick', OnDoubleClick);

            FrontTex.dispose();
            BackTex.dispose();
            LanyardTex.dispose();
            ExtrudeGeo.dispose();
            FaceGeo.dispose();
            RingGeo.dispose();
            BarrelGeo.dispose();
            BuckleGeo.dispose();
            StrapGeo.dispose();
            RimMat.dispose();
            FrontMat.dispose();
            BackMat.dispose();
            LightFrontMat.dispose();
            LightBackMat.dispose();
            MetalMat.dispose();
            StrapMat.dispose();
            Renderer.dispose();
            if (DomElem.parentNode === Container) {
                Container.removeChild(DomElem);
            }
        };
    }, [Name, Role, IdNumber, Clearance, Organization, Department, Zone, IssuedDate]);

    return (
        <div
            ref = {ContainerRef}
            className = {ClassName}
            style = {{
                width: '100%',
                height: '100%',
                minHeight: '480px',
                position: 'relative',
                userSelect: 'none',
                touchAction: 'pan-y pinch-zoom',
                ...Style,
            }}
            title = "Drag to swing • Double-click to flip"
        />
    );
}
