/**
 * ShareCard — 社交分享卡片包装组件
 *
 * 特性：
 * - 内部渲染 TalismanPosterV2（forwardRef 传递 SVG ref）
 * - 支持 size 预设：sm / md / lg / social
 * - Open Graph 元数据层（标题/描述/图片占位）
 * - SVG 内部样式全部内联（html2canvas 兼容）
 * - 外层包装使用 Tailwind CSS
 */
import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

import type { Gua64 } from '@/data/gua64'
import type { HexagramTalisman } from '@/data/hexagram-talismans'
import type { PosterStyleName } from '@/lib/posterStyles'
import { POSTER_STYLES } from '@/lib/posterStyles'
import { TalismanPosterV2 } from '@/components/TalismanPosterV2'
import { useStyleRecommendation } from '@/hooks/useStyleRecommendation'

export type ShareCardSize = 'sm' | 'md' | 'lg' | 'social'

export interface ShareCardProps {
  gua: Gua64
  talisman: HexagramTalisman
  style?: PosterStyleName
  title?: string
  description?: string
  size?: ShareCardSize
  showMetadata?: boolean
  className?: string
  wrapperClassName?: string
}

const SIZE_PRESETS: Record<ShareCardSize, { width: number; height: number }> = {
  sm: { width: 300, height: 450 },
  md: { width: 400, height: 600 },
  lg: { width: 600, height: 900 },
  social: { width: 1200, height: 630 },
}

export const ShareCard = React.forwardRef<SVGSVGElement, ShareCardProps>(
  (
    {
      gua,
      talisman,
      style,
      title,
      description,
      size = 'md',
      showMetadata = true,
      className,
      wrapperClassName,
    },
    ref
  ) => {
    const { width, height } = SIZE_PRESETS[size]
    const displayTitle = title ?? `${gua.name} · ${gua.nameEn}`
    const displayDesc = description ?? talisman.blessingTheme

    const { recommendation } = useStyleRecommendation(gua, talisman)
    const effectiveStyle: PosterStyleName = style ?? recommendation.primary
    const styleConfig = POSTER_STYLES[effectiveStyle]

    const ogStyles = useMemo(
      () => ({
        wrapper: {
          width: size === 'social' ? '100%' : `${width}px`,
          maxWidth: '100%',
        } as React.CSSProperties,
        metadataBar: {
          backgroundColor: '#1a1a1a',
          color: '#f5f5f5',
          padding: '12px 16px',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '13px',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        } as React.CSSProperties,
        ogTitle: {
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '1.4',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        } as React.CSSProperties,
        ogDesc: {
          fontSize: '12px',
          opacity: 0.7,
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        } as React.CSSProperties,
        ogImagePlaceholder: {
          width: '40px',
          height: '40px',
          borderRadius: '4px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        } as React.CSSProperties,
      }),
      [size, width]
    )

    return (
      <div
        className={cn(
          'relative flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-sm',
          wrapperClassName
        )}
        style={ogStyles.wrapper}
        data-sharecard-size={size}
      >
        {/* SVG 海报主体 */}
        <div className="relative flex items-center justify-center overflow-hidden">
          <TalismanPosterV2
            ref={ref}
            gua={gua}
            talisman={talisman}
            style={effectiveStyle}
            width={width}
            height={height}
            className={cn('block', className)}
          />
        </div>

        {/* Open Graph 元数据模拟层 */}
        {showMetadata && (
          <div style={ogStyles.metadataBar} className="flex items-center gap-3">
            <div style={ogStyles.ogImagePlaceholder}>
              <span role="img" aria-label="talisman">
                {gua.symbol}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div style={ogStyles.ogTitle}>{displayTitle}</div>
              <div style={ogStyles.ogDesc}>{displayDesc}</div>
            </div>
            <div
              style={{
                fontSize: '10px',
                opacity: 0.4,
                textTransform: 'uppercase' as const,
                letterSpacing: '1px',
                flexShrink: 0,
              }}
            >
              MYSTIC DAO
            </div>
          </div>
        )}
      </div>
    )
  }
)

ShareCard.displayName = 'ShareCard'

export default ShareCard
