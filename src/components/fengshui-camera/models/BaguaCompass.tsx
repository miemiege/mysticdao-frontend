import { useRef, useMemo } from 'react';
import type { JSX } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TaijiSymbol } from './TaijiSymbol';
import { ParticleRing } from './ParticleRing';

/* ------------------------------------------------------------------ */
/*  BaguaCompass – 3D 八卦罗盘主组件                                    */
/*  分层结构：底座 → 刻度环 → 八卦爻线 → 方向标签 → 太极 → 粒子环      */
/* ------------------------------------------------------------------ */

interface BaguaCompassProps {
  rotationY: number;
  quality: 'high' | 'medium' | 'low';
}

type YaoLine = 'yang' | 'yin';

interface TrigramInfo {
  char: string;
  lines: [YaoLine, YaoLine, YaoLine];
  angle: number;
  label: string;
}

/* 八卦数据：角度从北(0°)顺时针排列，lines 为上爻→中爻→下爻 */
const TRIGRAMS: TrigramInfo[] = [
  { char: '坎', lines: ['yin', 'yang', 'yin'], angle: 0, label: '北' },
  { char: '艮', lines: ['yang', 'yin', 'yin'], angle: 45, label: '东北' },
  { char: '震', lines: ['yin', 'yin', 'yang'], angle: 90, label: '东' },
  { char: '巽', lines: ['yang', 'yang', 'yin'], angle: 135, label: '东南' },
  { char: '离', lines: ['yang', 'yin', 'yang'], angle: 180, label: '南' },
  { char: '坤', lines: ['yin', 'yin', 'yin'], angle: 225, label: '西南' },
  { char: '兑', lines: ['yin', 'yang', 'yang'], angle: 270, label: '西' },
  { char: '乾', lines: ['yang', 'yang', 'yang'], angle: 315, label: '西北' },
];

/* ---------- 辅助函数：Canvas 文字 Sprite ---------- */
function createTextSprite(
  text: string,
  opts: { fontSize?: number; color?: string; scale?: number } = {},
): THREE.Sprite {
  const { fontSize = 72, color = '#c8a45c', scale = 0.35 } = opts;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 256;

  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, scale);
  return sprite;
}

/* ---------- 渲染单条爻线的辅助函数 ---------- */
function renderYaoLine(
  line: YaoLine,
  idx: number,
  y: number,
  goldMat: THREE.MeshStandardMaterial,
  yangGeo: THREE.BoxGeometry,
  yinGeo: THREE.BoxGeometry,
): JSX.Element {
  if (line === 'yang') {
    return (
      <mesh key={idx} geometry={yangGeo} material={goldMat} position={[0, y, 0]} />
    );
  }

  const gap = 0.032;
  const halfWidth = 0.065 / 2 + gap / 2;
  return (
    <group key={idx} position={[0, y, 0]}>
      <mesh geometry={yinGeo} material={goldMat} position={[-halfWidth, 0, 0]} />
      <mesh geometry={yinGeo} material={goldMat} position={[halfWidth, 0, 0]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  BaguaCompass                                                       */
/* ------------------------------------------------------------------ */

export function BaguaCompass({
  rotationY,
  quality,
}: BaguaCompassProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);

  const particleCount =
    quality === 'high' ? 200 : quality === 'medium' ? 100 : 0;

  /* ---------- 材质缓存 ---------- */
  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8a45c',
        metalness: 0.8,
        roughness: 0.3,
      }),
    [],
  );

  const topMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0f',
        roughness: 0.5,
        metalness: 0.4,
      }),
    [],
  );

  const sideMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7,
        metalness: 0.2,
      }),
    [],
  );

  /* ---------- 几何缓存 ---------- */
  const baseGeo = useMemo(
    () => new THREE.CylinderGeometry(2.0, 2.0, 0.15, 64),
    [],
  );

  const outerRingGeo = useMemo(
    () => new THREE.TorusGeometry(2.0, 0.022, 8, 128),
    [],
  );

  const innerRingGeo = useMemo(
    () => new THREE.TorusGeometry(0.55, 0.012, 8, 64),
    [],
  );

  const midRingGeo = useMemo(
    () => new THREE.TorusGeometry(1.65, 0.008, 8, 96),
    [],
  );

  const tickGeo = useMemo(
    () => new THREE.BoxGeometry(0.014, 0.006, 0.09),
    [],
  );

  const yangYaoGeo = useMemo(
    () => new THREE.BoxGeometry(0.18, 0.012, 0.006),
    [],
  );

  const yinYaoGeo = useMemo(
    () => new THREE.BoxGeometry(0.065, 0.012, 0.006),
    [],
  );

  /* ---------- 刻度 mesh 数据（72 个，每 5° 一个） ---------- */
  const tickData = useMemo(
    () =>
      Array.from({ length: 72 }, (_v, i) => {
        const angle = (i * 5 * Math.PI) / 180;
        const isMajor = i % 9 === 0; // 45° 主方向
        const r = 1.93;
        return {
          pos: [r * Math.sin(angle), 0.006, r * Math.cos(angle)] as [
            number,
            number,
            number,
          ],
          rot: angle,
          scale: isMajor
            ? ([1.6, 1, 1.5] as [number, number, number])
            : ([1, 1, 0.7] as [number, number, number]),
        };
      }),
    [],
  );

  /* ---------- 方向标签 Sprite ---------- */
  const directionSprites = useMemo(() => {
    return TRIGRAMS.map((t) => {
      const sprite = createTextSprite(t.label, { fontSize: 80, scale: 0.38 });
      const rad = (t.angle * Math.PI) / 180;
      const r = 0.75;
      sprite.position.set(r * Math.sin(rad), 0.14, r * Math.cos(rad));
      return sprite;
    });
  }, []);

  /* ---------- 八卦卦名字符 Sprite ---------- */
  const trigramSprites = useMemo(() => {
    return TRIGRAMS.map((t) => {
      const sprite = createTextSprite(t.char, { fontSize: 90, scale: 0.4 });
      const rad = (t.angle * Math.PI) / 180;
      const r = 1.45;
      sprite.position.set(r * Math.sin(rad), 0.14, r * Math.cos(rad));
      return sprite;
    });
  }, []);

  /* ---------- 8 条方向分隔线 ---------- */
  const dividerData = useMemo(
    () =>
      TRIGRAMS.map((t) => {
        const rad = (t.angle * Math.PI) / 180;
        const r = 1.275;
        return {
          pos: [r * Math.sin(rad), 0.004, r * Math.cos(rad)] as [
            number,
            number,
            number,
          ],
          rot: rad,
        };
      }),
    [],
  );

  /* ---------- 罗盘旋转 ---------- */
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationY;
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── 底座 ── */}
      <mesh
        geometry={baseGeo}
        material={[sideMat, topMat, sideMat]}
        position={[0, -0.075, 0]}
        castShadow
      />

      {/* ── 金色外环 ── */}
      <mesh
        geometry={outerRingGeo}
        material={goldMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
      />

      {/* ── 内圈金环 ── */}
      <mesh
        geometry={innerRingGeo}
        material={goldMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
      />

      {/* ── 中环金环 ── */}
      <mesh
        geometry={midRingGeo}
        material={goldMat}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
      />

      {/* ── 72 条刻度线 ── */}
      {tickData.map((t, i) => (
        <mesh
          key={`tick-${i}`}
          geometry={tickGeo}
          material={goldMat}
          position={t.pos}
          rotation={[0, t.rot, 0]}
          scale={t.scale}
        />
      ))}

      {/* ── 8 条方向分隔线 ── */}
      {dividerData.map((d, i) => (
        <mesh
          key={`div-${TRIGRAMS[i].char}`}
          position={d.pos}
          rotation={[0, d.rot, 0]}
        >
          <boxGeometry args={[0.008, 0.005, 1.35]} />
          <meshStandardMaterial
            color="#c8a45c"
            metalness={0.8}
            roughness={0.3}
            transparent
            opacity={0.25}
          />
        </mesh>
      ))}

      {/* ── 8 个八卦爻线 ── */}
      {TRIGRAMS.map((t) => {
        const rad = (t.angle * Math.PI) / 180;
        const r = 1.12;
        const x = r * Math.sin(rad);
        const z = r * Math.cos(rad);
        // 面向圆心：rotationY = rad 使局部 -Z 指向中心
        const rotY = rad;
        const spacing = 0.048;

        return (
          <group
            key={`yao-${t.char}`}
            position={[x, 0.08, z]}
            rotation={[0, rotY, 0]}
          >
            {t.lines.map((line, idx) => {
              const y = (1 - idx) * spacing; // 上爻在最上方
              return renderYaoLine(
                line,
                idx,
                y,
                goldMat,
                yangYaoGeo,
                yinYaoGeo,
              );
            })}
          </group>
        );
      })}

      {/* ── 方向文字标签 ── */}
      {directionSprites.map((sprite, i) => (
        <primitive key={`dir-${TRIGRAMS[i].char}`} object={sprite} />
      ))}

      {/* ── 八卦卦名标签 ── */}
      {trigramSprites.map((sprite, i) => (
        <primitive key={`tri-${TRIGRAMS[i].char}`} object={sprite} />
      ))}

      {/* ── 中心太极 ── */}
      <group position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <TaijiSymbol radius={0.35} />
      </group>

      {/* ── 粒子环 ── */}
      <ParticleRing count={particleCount} rotationY={rotationY} />
    </group>
  );
}
