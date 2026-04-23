/**
 * Share Platforms — 多平台分享卡配置
 */

export type PlatformKey = 'web' | 'instagram-feed' | 'instagram-story' | 'twitter' | 'wechat' | 'universal';

export interface PlatformConfig {
  name: string;
  width: number;
  height: number;
  ratio: string;
  layout: 'portrait' | 'landscape' | 'story' | 'square';
  /** 安全区：INS Story 顶部/底部需留白 */
  safeZone?: { top: number; bottom: number };
  /** 特性标签 */
  features: string[];
  /** 图标 */
  icon: string;
}

export const PLATFORMS: Record<PlatformKey, PlatformConfig> = {
  web: {
    name: 'Web',
    width: 1200,
    height: 1600,
    ratio: '3:4',
    layout: 'portrait',
    features: ['fullscreen', 'particles', 'glow'],
    icon: 'monitor',
  },
  'instagram-feed': {
    name: 'Instagram',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    layout: 'portrait',
    features: ['centered', 'brand-footer'],
    icon: 'instagram',
  },
  'instagram-story': {
    name: 'Story',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    layout: 'story',
    safeZone: { top: 250, bottom: 340 },
    features: ['fullscreen', 'swipe-up'],
    icon: 'smartphone',
  },
  twitter: {
    name: 'X / Twitter',
    width: 1200,
    height: 675,
    ratio: '16:9',
    layout: 'landscape',
    features: ['split-layout', 'big-text'],
    icon: 'twitter',
  },
  wechat: {
    name: 'WeChat',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    layout: 'story',
    features: ['fullscreen', 'qr-code'],
    icon: 'message-circle',
  },
  universal: {
    name: 'Universal',
    width: 800,
    height: 1200,
    ratio: '2:3',
    layout: 'portrait',
    features: ['traditional', 'compact'],
    icon: 'download',
  },
};

export const PLATFORM_LIST: { key: PlatformKey; config: PlatformConfig }[] = Object.entries(PLATFORMS).map(
  ([key, config]) => ({ key: key as PlatformKey, config })
);
