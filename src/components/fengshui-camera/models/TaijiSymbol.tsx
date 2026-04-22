import { useMemo } from 'react';
import type { JSX } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  TaijiSymbol – 中心太极阴阳鱼                                       */
/*  用 Three.js Shape 程序化绘制，黑白双鱼 + 鱼眼 + 金色边框            */
/* ------------------------------------------------------------------ */

interface TaijiSymbolProps {
  radius?: number;
}

export function TaijiSymbol({ radius = 0.35 }: TaijiSymbolProps): JSX.Element {
  /* ---------- 几何缓存 ---------- */
  const {
    whiteGeo,
    blackGeo,
    whiteDotGeo,
    blackDotGeo,
    borderGeo,
  } = useMemo(() => {
    const R = radius;
    const r = R / 2;

    // 白色鱼身（右侧阳鱼）
    const whiteShape = new THREE.Shape();
    whiteShape.moveTo(0, R);
    whiteShape.absarc(0, 0, R, Math.PI / 2, -Math.PI / 2, true);
    whiteShape.absarc(0, -r, r, -Math.PI / 2, Math.PI / 2, false);
    whiteShape.absarc(0, r, r, Math.PI / 2, -Math.PI / 2, true);
    whiteShape.closePath();

    // 黑色鱼身（左侧阴鱼）
    const blackShape = new THREE.Shape();
    blackShape.moveTo(0, R);
    blackShape.absarc(0, 0, R, Math.PI / 2, 3 * Math.PI / 2, false);
    blackShape.absarc(0, -r, r, -Math.PI / 2, Math.PI / 2, true);
    blackShape.absarc(0, r, r, Math.PI / 2, -Math.PI / 2, false);
    blackShape.closePath();

    return {
      whiteGeo: new THREE.ShapeGeometry(whiteShape, 32),
      blackGeo: new THREE.ShapeGeometry(blackShape, 32),
      whiteDotGeo: new THREE.CircleGeometry(r / 3, 16),
      blackDotGeo: new THREE.CircleGeometry(r / 3, 16),
      borderGeo: new THREE.TorusGeometry(R, 0.015, 8, 64),
    };
  }, [radius]);

  /* ---------- 材质缓存 ---------- */
  const whiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f5f0e0',
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );

  const blackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0a0a0a',
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );

  const goldMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c8a45c',
        roughness: 0.3,
        metalness: 0.8,
      }),
    [],
  );

  const halfR = radius / 2;

  return (
    <group>
      {/* 白色阳鱼 */}
      <mesh geometry={whiteGeo} material={whiteMat} />

      {/* 黑色阴鱼 */}
      <mesh geometry={blackGeo} material={blackMat} />

      {/* 白鱼黑眼（阳中有阴） */}
      <mesh
        geometry={blackDotGeo}
        material={blackMat}
        position={[0, -halfR, 0.001]}
      />

      {/* 黑鱼白眼（阴中有阳） */}
      <mesh
        geometry={whiteDotGeo}
        material={whiteMat}
        position={[0, halfR, 0.001]}
      />

      {/* 金色边框 */}
      <mesh
        geometry={borderGeo}
        material={goldMat}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
