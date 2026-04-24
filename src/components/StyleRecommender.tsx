/**
 * StyleRecommender — 智能风格推荐结果展示组件
 *
 * 展示 primary / secondary 两种风格的预览缩略图，
 * 推荐理由（英文 + 中文），置信度进度条，以及应用按钮。
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { PosterStyleName, PosterStyleConfig } from '@/lib/posterStyles';
import { POSTER_STYLES } from '@/lib/posterStyles';
import type { Gua64 } from '@/data/gua64';
import type { HexagramTalisman } from '@/data/hexagram-talismans';
import { useStyleRecommendation } from '@/hooks/useStyleRecommendation';
import { Sparkles, RotateCcw, Check, Palette } from 'lucide-react';

export interface StyleRecommenderProps {
  gua: Gua64;
  talisman?: HexagramTalisman;
  onApplyPrimary?: (style: PosterStyleName) => void;
  onApplySecondary?: (style: PosterStyleName) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* 小型风格预览色块                                                     */
/* ------------------------------------------------------------------ */

const StylePreview: React.FC<{ style: PosterStyleName; label: string; rank: 'primary' | 'secondary' }> = React.memo(
  ({ style, label, rank }) => {
    const config: PosterStyleConfig = POSTER_STYLES[style];
    const isPrimary = rank === 'primary';

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-lg border-2 shadow-sm"
          style={{
            width: 120,
            height: 160,
            background: config.bgGradient || config.bgColor,
            borderColor: isPrimary ? config.accentColor : config.borderColor,
          }}
        >
          {/* 装饰性顶部条 */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: config.accentColor, opacity: 0.8 }}
          />
          {/* 卦名占位 */}
          <div className="flex flex-col items-center gap-1 px-2">
            <span
              className="text-lg font-bold"
              style={{ color: config.textColor, fontFamily: config.fontFamily }}
            >
              {config.label}
            </span>
            <span
              className="text-[10px] uppercase tracking-wider opacity-70"
              style={{ color: config.textColor, fontFamily: config.fontFamilyEn }}
            >
              {config.labelEn}
            </span>
          </div>
          {/* 底部印章小圆 */}
          <div
            className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full border text-[8px] font-bold"
            style={{
              borderColor: config.sealColor,
              color: config.sealColor,
              backgroundColor: config.sealBg || 'transparent',
            }}
          >
            印
          </div>
          {/* Primary 角标 */}
          {isPrimary && (
            <Badge
              className="absolute top-2 left-2 text-[10px]"
              style={{
                backgroundColor: config.accentColor,
                color: config.bgColor,
                borderColor: 'transparent',
              }}
            >
              Best
            </Badge>
          )}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    );
  }
);
StylePreview.displayName = 'StylePreview';

/* ------------------------------------------------------------------ */
/* 主组件                                                              */
/* ------------------------------------------------------------------ */

export const StyleRecommender: React.FC<StyleRecommenderProps> = ({
  gua,
  talisman,
  onApplyPrimary,
  onApplySecondary,
  className,
}) => {
  const { recommendation, refresh } = useStyleRecommendation(gua, talisman);

  const handleApplyPrimary = () => {
    onApplyPrimary?.(recommendation.primary);
  };

  const handleApplySecondary = () => {
    onApplySecondary?.(recommendation.secondary);
  };

  return (
    <Card className={className} data-testid="style-recommender">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base font-semibold">Smart Style Match</CardTitle>
        </div>
        <CardDescription className="text-sm">
          AI-powered style recommendation based on element, fortune, blessing theme &amp; keywords
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* 双风格预览 */}
        <div className="flex items-start justify-center gap-6">
          <StylePreview
            style={recommendation.primary}
            label="Primary"
            rank="primary"
          />
          <div className="flex h-40 flex-col items-center justify-center">
            <div className="text-muted-foreground text-xs">or</div>
          </div>
          <StylePreview
            style={recommendation.secondary}
            label="Secondary"
            rank="secondary"
          />
        </div>

        {/* 推荐理由 */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Recommendation Reason</span>
          </div>
          <p className="text-sm text-foreground">{recommendation.reason}</p>
          <p className="mt-1 text-sm text-muted-foreground">{recommendation.reasonZh}</p>
        </div>

        {/* 置信度 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Confidence</span>
            <span className="text-xs font-semibold tabular-nums">
              {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>
          <Progress value={recommendation.confidence * 100} className="h-2" />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={refresh}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Recalculate
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleApplySecondary}
          >
            Apply Secondary
          </Button>
          <Button
            variant="default"
            size="sm"
            className="gap-1.5"
            onClick={handleApplyPrimary}
          >
            <Check className="h-3.5 w-3.5" />
            Apply Primary
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StyleRecommender;
