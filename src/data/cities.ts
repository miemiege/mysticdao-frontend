/**
 * 中国主要城市经度表（东经为正）
 * 数据来源：国家测绘地理信息局标准坐标
 * 用于八字排盘真太阳时换算
 */

export interface CityInfo {
  name: string;
  longitude: number; // 东经度数
  latitude?: number; // 北纬度数（预留）
}

/** 直辖市 */
export const DIRECT_CITIES: CityInfo[] = [
  { name: '北京', longitude: 116.4074 },
  { name: '上海', longitude: 121.4737 },
  { name: '天津', longitude: 117.2008 },
  { name: '重庆', longitude: 106.5516 },
];

/** 省会城市（按地区分组） */
export const PROVINCIAL_CAPITALS: CityInfo[] = [
  // 华北
  { name: '石家庄', longitude: 114.5149 },
  { name: '太原', longitude: 112.5489 },
  { name: '呼和浩特', longitude: 111.7492 },
  { name: '济南', longitude: 117.1205 },
  { name: '郑州', longitude: 113.6253 },
  // 东北
  { name: '沈阳', longitude: 123.4315 },
  { name: '长春', longitude: 125.3235 },
  { name: '哈尔滨', longitude: 126.5350 },
  // 华东
  { name: '南京', longitude: 118.7969 },
  { name: '杭州', longitude: 120.1551 },
  { name: '合肥', longitude: 117.2272 },
  { name: '福州', longitude: 119.2965 },
  { name: '南昌', longitude: 115.8540 },
  // 华中/华南
  { name: '武汉', longitude: 114.3054 },
  { name: '长沙', longitude: 112.9388 },
  { name: '广州', longitude: 113.2644 },
  { name: '南宁', longitude: 108.3661 },
  { name: '海口', longitude: 110.3492 },
  // 西南
  { name: '成都', longitude: 104.0668 },
  { name: '贵阳', longitude: 106.6302 },
  { name: '昆明', longitude: 102.8329 },
  { name: '拉萨', longitude: 91.1409 },
  // 西北
  { name: '西安', longitude: 108.9398 },
  { name: '兰州', longitude: 103.8343 },
  { name: '西宁', longitude: 101.7782 },
  { name: '银川', longitude: 106.2309 },
  { name: '乌鲁木齐', longitude: 87.6168 },
];

/** 其他主要城市 */
export const OTHER_MAJOR_CITIES: CityInfo[] = [
  { name: '深圳', longitude: 114.0579 },
  { name: '珠海', longitude: 113.5767 },
  { name: '厦门', longitude: 118.0894 },
  { name: '苏州', longitude: 120.5853 },
  { name: '宁波', longitude: 121.5440 },
  { name: '青岛', longitude: 120.3826 },
  { name: '大连', longitude: 121.6147 },
  { name: '桂林', longitude: 110.1790 },
  { name: '三亚', longitude: 109.5082 },
  { name: '丽江', longitude: 100.2271 },
  { name: '敦煌', longitude: 94.6616 },
];

/** 所有城市合并列表 */
export const ALL_CITIES: CityInfo[] = [
  ...DIRECT_CITIES,
  ...PROVINCIAL_CAPITALS,
  ...OTHER_MAJOR_CITIES,
];

/** 根据城市名查找经度 */
export function getCityLongitude(name: string): number | undefined {
  const city = ALL_CITIES.find(c => c.name === name);
  return city?.longitude;
}

/** 默认城市（北京，东经116.4°） */
export const DEFAULT_CITY = '北京';
export const DEFAULT_LONGITUDE = 116.4074;
