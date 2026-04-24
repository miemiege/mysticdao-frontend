/**
 * 64卦 AI 符咒图片映射表 (VINTAGE复古版)
 * 米色纸张+多印章+龙凤八卦+毛笔书法+中英文双语
 */

export const TALISMAN_IMAGES: Record<string, string> = {
  "乾为天": "./talismans/vintage/01-乾为天.jpg",
  "坤为地": "./talismans/vintage/02-坤为地.jpg",
  "水雷屯": "./talismans/vintage/03-水雷屯.jpg",
  "山水蒙": "./talismans/vintage/04-山水蒙.jpg",
  "水天需": "./talismans/vintage/05-水天需.jpg",
  "天水讼": "./talismans/vintage/06-天水讼.jpg",
  "地水师": "./talismans/vintage/07-地水师.jpg",
  "水地比": "./talismans/vintage/08-水地比.jpg",
  "风天小畜": "./talismans/vintage/09-风天小畜.jpg",
  "天泽履": "./talismans/vintage/10-天泽履.jpg",
  "地天泰": "./talismans/vintage/11-地天泰.jpg",
  "天地否": "./talismans/vintage/12-天地否.jpg",
  "天火同人": "./talismans/vintage/13-天火同人.jpg",
  "火天大有": "./talismans/vintage/14-火天大有.jpg",
  "地山谦": "./talismans/vintage/15-地山谦.jpg",
  "雷地豫": "./talismans/vintage/16-雷地豫.jpg",
  "泽雷随": "./talismans/vintage/17-泽雷随.jpg",
  "山风蛊": "./talismans/vintage/18-山风蛊.jpg",
  "地泽临": "./talismans/vintage/19-地泽临.jpg",
  "风地观": "./talismans/vintage/20-风地观.jpg",
  "火雷噬嗑": "./talismans/vintage/21-火雷噬嗑.jpg",
  "山火贲": "./talismans/vintage/22-山火贲.jpg",
  "山地剥": "./talismans/vintage/23-山地剥.jpg",
  "地雷复": "./talismans/vintage/24-地雷复.jpg",
  "天雷无妄": "./talismans/vintage/25-天雷无妄.jpg",
  "山天大畜": "./talismans/vintage/26-山天大畜.jpg",
  "山雷颐": "./talismans/vintage/27-山雷颐.jpg",
  "泽风大过": "./talismans/vintage/28-泽风大过.jpg",
  "坎为水": "./talismans/vintage/29-坎为水.jpg",
  "离为火": "./talismans/vintage/30-离为火.jpg",
  "泽山咸": "./talismans/vintage/31-泽山咸.jpg",
  "雷风恒": "./talismans/vintage/32-雷风恒.jpg",
  "天山遁": "./talismans/vintage/33-天山遁.jpg",
  "雷天大壮": "./talismans/vintage/34-雷天大壮.jpg",
  "火地晋": "./talismans/vintage/35-火地晋.jpg",
  "地火明夷": "./talismans/vintage/36-地火明夷.jpg",
  "风火家人": "./talismans/vintage/37-风火家人.jpg",
  "火泽睽": "./talismans/vintage/38-火泽睽.jpg",
  "水山蹇": "./talismans/vintage/39-水山蹇.jpg",
  "雷水解": "./talismans/vintage/40-雷水解.jpg",
  "山泽损": "./talismans/vintage/41-山泽损.jpg",
  "风雷益": "./talismans/vintage/42-风雷益.jpg",
  "泽天夬": "./talismans/vintage/43-泽天夬.jpg",
  "天风姤": "./talismans/vintage/44-天风姤.jpg",
  "泽地萃": "./talismans/vintage/45-泽地萃.jpg",
  "地风升": "./talismans/vintage/46-地风升.jpg",
  "泽水困": "./talismans/vintage/47-泽水困.jpg",
  "水风井": "./talismans/vintage/48-水风井.jpg",
  "泽火革": "./talismans/vintage/49-泽火革.jpg",
  "火风鼎": "./talismans/vintage/50-火风鼎.jpg",
  "震为雷": "./talismans/vintage/51-震为雷.jpg",
  "艮为山": "./talismans/vintage/52-艮为山.jpg",
  "风山渐": "./talismans/vintage/53-风山渐.jpg",
  "雷泽归妹": "./talismans/vintage/54-雷泽归妹.jpg",
  "雷火丰": "./talismans/vintage/55-雷火丰.jpg",
  "火山旅": "./talismans/vintage/56-火山旅.jpg",
  "巽为风": "./talismans/vintage/57-巽为风.jpg",
  "兑为泽": "./talismans/vintage/58-兑为泽.jpg",
  "风水涣": "./talismans/vintage/59-风水涣.jpg",
  "水泽节": "./talismans/vintage/60-水泽节.jpg",
  "风泽中孚": "./talismans/vintage/61-风泽中孚.jpg",
  "雷山小过": "./talismans/vintage/62-雷山小过.jpg",
  "水火既济": "./talismans/vintage/63-水火既济.jpg",
  "火水未济": "./talismans/vintage/64-火水未济.jpg",
};

/**
 * 获取卦象对应的符咒图片路径
 * @param hexagramName 卦名 (如 "乾为天")
 * @returns 图片路径，不存在时返回 null
 */
export function getTalismanImage(hexagramName: string): string | null {
  return TALISMAN_IMAGES[hexagramName] || null;
}
