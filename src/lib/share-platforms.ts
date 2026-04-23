export type PlatformKey = 'web' | 'instagram-feed' | 'instagram-story' | 'twitter' | 'wechat' | 'universal';

export interface PlatformConfig {
  key: PlatformKey;
  label: string;
  icon: string;
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
}

export const PLATFORM_CONFIGS: Record<PlatformKey, PlatformConfig> = {
  web: {
    key: 'web',
    label: 'Web',
    icon: 'globe',
    width: 1200,
    height: 630,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
  'instagram-feed': {
    key: 'instagram-feed',
    label: 'INS Feed',
    icon: 'camera',
    width: 1080,
    height: 1080,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
  'instagram-story': {
    key: 'instagram-story',
    label: 'INS Story',
    icon: 'smartphone',
    width: 1080,
    height: 1920,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
  twitter: {
    key: 'twitter',
    label: 'Twitter',
    icon: 'twitter',
    width: 1200,
    height: 675,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
  wechat: {
    key: 'wechat',
    label: 'WeChat',
    icon: 'message-circle',
    width: 900,
    height: 500,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
  universal: {
    key: 'universal',
    label: 'Universal',
    icon: 'share-2',
    width: 1200,
    height: 1200,
    bgColor: '#000000',
    textColor: '#C8A45C',
  },
};

export const PLATFORM_LIST: PlatformConfig[] = Object.values(PLATFORM_CONFIGS);
