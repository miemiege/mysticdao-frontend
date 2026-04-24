/**
 * ShareCardContainer — 分享卡片容器 + 控制面板
 *
 * 特性：
 * - 接收一组卦象数据，展示卡片网格
 * - 每个卡片带风格切换下拉菜单（shadcn/ui Select）
 * - "Copy Link" 与 "Download" 按钮
 * - 响应式网格：1列(sm) → 2列(md) → 3列(lg)
 * - 使用 shadcn/ui 的 Card, Select, Button 组件
 */
import React, { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Share2, Link2, ImageDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import type { Gua64 } from '@/data/gua64'
import type { HexagramTalisman } from '@/data/hexagram-talismans'
import type { PosterStyleName } from '@/lib/posterStyles'
import { POSTER_STYLES } from '@/lib/posterStyles'
import { ShareCard } from './ShareCard'

export interface ShareCardContainerItem {
  gua: Gua64
  talisman: HexagramTalisman
  defaultStyle?: PosterStyleName
}

export interface ShareCardContainerProps {
  items: ShareCardContainerItem[]
  className?: string
  onDownload?: (gua: Gua64, style: PosterStyleName) => void
  onCopyLink?: (url: string) => void
}

const styleOptions: { value: PosterStyleName; label: string }[] = [
  { value: 'ink', label: '水墨 Ink Wash' },
  { value: 'dark', label: '暗黑 Dark Mystic' },
  { value: 'royal', label: '皇家金 Imperial Gold' },
  { value: 'vintage', label: '复古 Vintage' },
  { value: 'tianshi', label: '天师黄 Tianshi Yellow' },
  { value: 'blackgold', label: '黑金 Black & Gold' },
]

export const ShareCardContainer: React.FC<ShareCardContainerProps> = ({
  items,
  className,
  onDownload,
  onCopyLink,
}) => {
  const [styles, setStyles] = useState<Record<number, PosterStyleName>>(() => {
    const initial: Record<number, PosterStyleName> = {}
    items.forEach((item) => {
      initial[item.gua.number] = item.defaultStyle ?? 'ink'
    })
    return initial
  })

  const [copiedMap, setCopiedMap] = useState<Record<number, boolean>>({})

  const handleStyleChange = useCallback((guaNumber: number, newStyle: PosterStyleName) => {
    setStyles((prev) => ({ ...prev, [guaNumber]: newStyle }))
  }, [])

  const handleCopy = useCallback(
    (gua: Gua64) => {
      const url = `https://mysticdao.app/gua/${gua.number}`
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url).catch(() => {})
      }
      onCopyLink?.(url)
      setCopiedMap((prev) => ({ ...prev, [gua.number]: true }))
      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [gua.number]: false }))
      }, 2000)
    },
    [onCopyLink]
  )

  const handleDownload = useCallback(
    (gua: Gua64, style: PosterStyleName) => {
      onDownload?.(gua, style)
    },
    [onDownload]
  )

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6 flex items-center gap-2.5">
        <Share2 className="size-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold tracking-tight">Share Cards</h2>
        <span className="text-sm text-muted-foreground">({items.length})</span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item) => {
            const currentStyle = styles[item.gua.number] ?? 'ink'
            const styleConfig = POSTER_STYLES[currentStyle]
            const isCopied = copiedMap[item.gua.number] ?? false

            return (
              <motion.div
                key={item.gua.number}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                <Card className="flex flex-col overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base">
                          {item.gua.symbol} {item.gua.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {item.gua.nameEn} · {item.talisman.blessingTheme}
                        </CardDescription>
                      </div>
                      <div
                        className="size-3 shrink-0 rounded-full border border-border"
                        style={{ backgroundColor: styleConfig.bgColor }}
                        title={styleConfig.label}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="flex justify-center px-4 pb-0">
                    <ShareCard
                      gua={item.gua}
                      talisman={item.talisman}
                      style={currentStyle}
                      size="sm"
                      showMetadata={false}
                      wrapperClassName="shadow-none border-0"
                    />
                  </CardContent>

                  <CardFooter className="mt-4 flex flex-col gap-3 px-4 pb-4">
                    <div className="flex w-full items-center gap-2">
                      <Select
                        value={currentStyle}
                        onValueChange={(val) =>
                          handleStyleChange(item.gua.number, val as PosterStyleName)
                        }
                      >
                        <SelectTrigger className="h-8 flex-1 text-xs">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => handleCopy(item.gua)}
                      >
                        {isCopied ? (
                          <Link2 className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        {isCopied ? 'Copied' : 'Copy Link'}
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1.5 px-3 text-xs"
                        onClick={() => handleDownload(item.gua, currentStyle)}
                      >
                        <ImageDown className="size-3.5" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

ShareCardContainer.displayName = 'ShareCardContainer'

export default ShareCardContainer
