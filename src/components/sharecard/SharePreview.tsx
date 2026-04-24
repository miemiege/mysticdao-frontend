/**
 * SharePreview — 分享预览模拟器
 *
 * 特性：
 * - 模拟 Twitter/X、Facebook、微信的分享卡片预览
 * - 显示缩略图、标题、描述
 * - 纯展示组件，无实际分享功能
 * - 使用内联 style 确保 SVG / 图片占位兼容 html2canvas
 */
import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

import type { Gua64 } from '@/data/gua64'
import type { HexagramTalisman } from '@/data/hexagram-talismans'

export type SharePlatform = 'twitter' | 'facebook' | 'wechat'

export interface SharePreviewProps {
  gua: Gua64
  talisman: HexagramTalisman
  platform?: SharePlatform
  title?: string
  description?: string
  imageUrl?: string
  className?: string
}

interface PlatformStyles {
  cardBg: string
  cardBorder: string
  cardRadius: string
  cardShadow: string
  fontFamily: string
  titleColor: string
  descColor: string
  domainColor: string
  imageRadius: string
  imageAspect: string
  width: string
}

const PLATFORM_CONFIG: Record<SharePlatform, PlatformStyles> = {
  twitter: {
    cardBg: '#000000',
    cardBorder: '1px solid rgb(47, 51, 54)',
    cardRadius: '12px',
    cardShadow: 'none',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    titleColor: '#e7e9ea',
    descColor: '#71767b',
    domainColor: '#71767b',
    imageRadius: '12px 12px 0 0',
    imageAspect: '56.25%', // 16:9
    width: '500px',
  },
  facebook: {
    cardBg: '#f0f2f5',
    cardBorder: '1px solid #dadde1',
    cardRadius: '8px',
    cardShadow: '0 1px 2px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    titleColor: '#1c1e21',
    descColor: '#65676b',
    domainColor: '#65676b',
    imageRadius: '8px 8px 0 0',
    imageAspect: '52.36%', // ~1.91:1
    width: '500px',
  },
  wechat: {
    cardBg: '#ffffff',
    cardBorder: '1px solid #e5e5e5',
    cardRadius: '6px',
    cardShadow: '0 2px 8px rgba(0,0,0,0.06)',
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    titleColor: '#000000',
    descColor: '#888888',
    domainColor: '#888888',
    imageRadius: '6px 6px 0 0',
    imageAspect: '75%', // 4:3
    width: '320px',
  },
}

const PLATFORM_LABELS: Record<SharePlatform, string> = {
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  wechat: 'WeChat',
}

export const SharePreview: React.FC<SharePreviewProps> = ({
  gua,
  talisman,
  platform = 'twitter',
  title,
  description,
  imageUrl,
  className,
}) => {
  const config = PLATFORM_CONFIG[platform]
  const displayTitle = title ?? `${gua.name} · ${gua.nameEn}`
  const displayDesc = description ?? gua.judgmentEn
  const displayDomain = 'mysticdao.app'

  const cardStyles = useMemo(
    () =>
      ({
        wrapper: {
          width: config.width,
          maxWidth: '100%',
        } as React.CSSProperties,
        card: {
          backgroundColor: config.cardBg,
          border: config.cardBorder,
          borderRadius: config.cardRadius,
          boxShadow: config.cardShadow,
          overflow: 'hidden',
          fontFamily: config.fontFamily,
        } as React.CSSProperties,
        imageBox: {
          position: 'relative' as const,
          width: '100%',
          paddingBottom: config.imageAspect,
          backgroundColor: platform === 'twitter' ? '#16181c' : '#e4e6eb',
          borderRadius: config.imageRadius,
          overflow: 'hidden',
        } as React.CSSProperties,
        imageInner: {
          position: 'absolute' as const,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        } as React.CSSProperties,
        body: {
          padding: platform === 'twitter' ? '12px 16px' : platform === 'facebook' ? '12px 16px' : '10px 12px',
        } as React.CSSProperties,
        title: {
          color: config.titleColor,
          fontSize: platform === 'wechat' ? '15px' : '15px',
          fontWeight: 600,
          lineHeight: '1.35',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        } as React.CSSProperties,
        desc: {
          color: config.descColor,
          fontSize: platform === 'wechat' ? '13px' : '14px',
          lineHeight: '1.4',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        } as React.CSSProperties,
        domain: {
          color: config.domainColor,
          fontSize: '12px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        } as React.CSSProperties,
      }),
    [config, platform]
  )

  return (
    <div className={cn('flex flex-col gap-2', className)} style={cardStyles.wrapper}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <PlatformIcon platform={platform} />
        <span>{PLATFORM_LABELS[platform]} Preview</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={cardStyles.card}
      >
        {/* 图片区域 */}
        <div style={cardStyles.imageBox}>
          <div style={cardStyles.imageInner}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={displayTitle}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 225"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                <rect width="400" height="225" fill={platform === 'twitter' ? '#16181c' : '#e4e6eb'} />
                <text
                  x="200"
                  y="100"
                  textAnchor="middle"
                  fill={platform === 'twitter' ? '#e7e9ea' : '#1c1e21'}
                  fontSize="48"
                  fontFamily="'Noto Serif SC', serif"
                  opacity="0.9"
                >
                  {gua.symbol}
                </text>
                <text
                  x="200"
                  y="140"
                  textAnchor="middle"
                  fill={platform === 'twitter' ? '#71767b' : '#65676b'}
                  fontSize="12"
                  fontFamily="'Cinzel', serif"
                  letterSpacing="2"
                >
                  {gua.nameEn.toUpperCase()}
                </text>
                <text
                  x="200"
                  y="160"
                  textAnchor="middle"
                  fill={platform === 'twitter' ? '#71767b' : '#65676b'}
                  fontSize="10"
                  fontFamily="'Cinzel', serif"
                  letterSpacing="1"
                  opacity="0.6"
                >
                  {talisman.blessingTheme}
                </text>
              </svg>
            )}
          </div>
        </div>

        {/* 文字区域 */}
        <div style={cardStyles.body}>
          <div style={cardStyles.title}>{displayTitle}</div>
          <div style={cardStyles.desc}>{displayDesc}</div>
          <div style={cardStyles.domain}>{displayDomain}</div>
        </div>
      </motion.div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: SharePlatform }) {
  const icons: Record<SharePlatform, React.ReactNode> = {
    twitter: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    facebook: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    wechat: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.905c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
      </svg>
    ),
  }
  return <span className="inline-flex text-muted-foreground">{icons[platform]}</span>
}

export default SharePreview
