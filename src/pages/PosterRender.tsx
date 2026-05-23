/**
 * PosterRender — Playwright 批量截图专用路由
 *
 * 纯海报渲染，无 UI chrome。
 * 用于脚本批量截取 64 卦符咒海报为 PNG。
 *
 * URL: /render/:guaName?w=800&h=1280&variant=default
 */

import { useParams, useSearchParams } from 'react-router';
import TalismanPoster from '../components/talisman/TalismanPoster';

export default function PosterRenderPage() {
  const { guaName } = useParams<{ guaName: string }>();
  const [searchParams] = useSearchParams();

  const width = parseInt(searchParams.get('w') || '800', 10);
  const height = parseInt(searchParams.get('h') || '1280', 10);
  const variant = (searchParams.get('variant') as 'default' | 'lantern-core') || 'default';
  const cyber = searchParams.get('cyber') !== '0';

  if (!guaName) {
    return (
      <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#C9A227' }}>
        Missing guaName
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <TalismanPoster
        hexagramName={decodeURIComponent(guaName)}
        width={width}
        height={height}
        showSeal={true}
        cyberMode={cyber}
        variant={variant}
        useNewAssets={true}
      />
    </div>
  );
}
