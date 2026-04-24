/**
 * ExportTester.tsx — 导出测试面板（开发调试专用）
 *
 * Features:
 *   - 6种风格导出预览缩略图
 *   - 显示每种风格的导出耗时
 *   - 导出成功/失败状态
 *   - 文件大小信息
 *   - "Batch Export All" 批量测试
 *   - 结果表格展示
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Play, ImageOff, CheckCircle2, XCircle, Clock, FileType, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TalismanPosterV2 } from '@/components/TalismanPosterV2';
import { POSTER_STYLES, type PosterStyleName } from '@/lib/posterStyles';
import { GUA64_LIST } from '@/data/gua64';
import { HEXAGRAM_TALISMANS } from '@/data/hexagram-talismans';
import { exportPosterToImage, formatFileSize, revokeExportUrl } from '@/lib/exportPoster';
import { getRecommendedFormat } from '@/lib/exportCompatibility';

/* ─── 类型 ─── */

interface TestResult {
  style: PosterStyleName;
  styleLabel: string;
  durationMs: number;
  sizeBytes: number;
  success: boolean;
  error?: string;
  previewUrl?: string;
}

/* ─── 常量 ─── */

const STYLE_ORDER: PosterStyleName[] = ['ink', 'dark', 'royal', 'vintage', 'tianshi', 'blackgold', 'cybertao', 'zengarden'];
const TEST_GUA = GUA64_LIST[0]; // 乾为天
const TEST_TALISMAN = HEXAGRAM_TALISMANS[TEST_GUA.name] ?? {
  hexagramName: TEST_GUA.name,
  blessingTheme: '天官赐福',
  category: '天官赐福',
  element: '金',
  svgPath: null,
  placeholderSeed: 1,
};

/* ─── 子组件：单个风格预览卡片 ─── */

const StylePreviewCard: React.FC<{
  style: PosterStyleName;
  result?: TestResult;
  onRun: (style: PosterStyleName) => void;
  running: boolean;
}> = ({ style, result, onRun, running }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const config = POSTER_STYLES[style];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{config.labelEn}</CardTitle>
          <Badge variant={result?.success ? 'default' : 'outline'} className="text-xs">
            {result?.success ? <CheckCircle2 className="size-3 mr-1" /> : result ? <XCircle className="size-3 mr-1" /> : null}
            {result ? (result.success ? 'OK' : 'FAIL') : '—'}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{config.label}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* SVG 预览（隐藏，仅用于导出） */}
        <div className="relative bg-muted rounded-md overflow-hidden" style={{ width: 160, height: 240 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <TalismanPosterV2
              ref={svgRef}
              gua={TEST_GUA}
              talisman={TEST_TALISMAN}
              style={style}
              width={160}
              height={240}
              showDecorations
              showFilters
            />
          </div>
          {/* 预览遮罩/缩略图占位 */}
          {result?.previewUrl && (
            <img
              src={result.previewUrl}
              alt={`${config.labelEn} preview`}
              className="absolute inset-0 w-full h-full object-contain bg-background"
            />
          )}
        </div>

        {/* 信息行 */}
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            {result ? `${result.durationMs}ms` : '—'}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileType className="size-3" />
            {result ? formatFileSize(result.sizeBytes) : '—'}
          </div>
        </div>

        {result?.error && (
          <p className="text-xs text-destructive truncate" title={result.error}>
            {result.error}
          </p>
        )}

        {/* 操作按钮 */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1"
          disabled={running}
          onClick={() => onRun(style)}
        >
          {running ? <Spinner className="size-3" /> : <Play className="size-3" />}
          {running ? 'Testing...' : 'Test Export'}
        </Button>
      </CardContent>
    </Card>
  );
};

/* ─── 主组件 ─── */

export const ExportTester: React.FC = () => {
  const [results, setResults] = useState<Record<PosterStyleName, TestResult | undefined>>(
    () => ({
      ink: undefined,
      dark: undefined,
      royal: undefined,
      vintage: undefined,
      tianshi: undefined,
      blackgold: undefined,
      cybertao: undefined,
      zengarden: undefined,
    })
  );
  const [runningStyle, setRunningStyle] = useState<PosterStyleName | null>(null);
  const [batchRunning, setBatchRunning] = useState(false);
  const svgRefs = useRef<Record<PosterStyleName, React.RefObject<SVGSVGElement | null>>>(
    STYLE_ORDER.reduce((acc, s) => {
      acc[s] = React.createRef<SVGSVGElement>();
      return acc;
    }, {} as Record<PosterStyleName, React.RefObject<SVGSVGElement | null>>)
  );

  // 确保 refs 稳定
  const stableRefs = useMemo(() => svgRefs.current, []);

  const runSingleTest = useCallback(
    async (style: PosterStyleName): Promise<TestResult> => {
      const svg = stableRefs[style]?.current;
      if (!svg) {
        return {
          style,
          styleLabel: POSTER_STYLES[style].labelEn,
          durationMs: 0,
          sizeBytes: 0,
          success: false,
          error: 'SVG ref not available',
        };
      }

      const start = performance.now();
      try {
        const rec = getRecommendedFormat();
        const exported = await exportPosterToImage(svg, {
          format: 'png',
          scale: rec.scale,
          quality: 0.92,
          ignoreFilters: rec.useFilters === false,
        });

        const durationMs = Math.round(performance.now() - start);

        return {
          style,
          styleLabel: POSTER_STYLES[style].labelEn,
          durationMs,
          sizeBytes: exported.blob.size,
          success: true,
          previewUrl: exported.url,
        };
      } catch (err) {
        const durationMs = Math.round(performance.now() - start);
        return {
          style,
          styleLabel: POSTER_STYLES[style].labelEn,
          durationMs,
          sizeBytes: 0,
          success: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    [stableRefs]
  );

  const handleRunSingle = useCallback(
    async (style: PosterStyleName) => {
      if (runningStyle || batchRunning) return;
      setRunningStyle(style);

      const prev = results[style];
      if (prev?.previewUrl) {
        revokeExportUrl(prev.previewUrl);
      }

      const result = await runSingleTest(style);
      setResults((prev) => ({ ...prev, [style]: result }));
      setRunningStyle(null);

      if (result.success) {
        toast.success(`${result.styleLabel} exported`, {
          description: `${formatFileSize(result.sizeBytes)} · ${result.durationMs}ms`,
        });
      } else {
        toast.error(`${result.styleLabel} failed`, {
          description: result.error ?? 'Unknown error',
        });
      }
    },
    [batchRunning, results, runSingleTest, runningStyle]
  );

  const handleBatchExport = useCallback(async () => {
    if (runningStyle || batchRunning) return;
    setBatchRunning(true);
    const toastId = toast.loading('Running batch export for all 6 styles...');

    const newResults: Record<PosterStyleName, TestResult | undefined> = { ...results };
    let successCount = 0;
    let failCount = 0;

    for (const style of STYLE_ORDER) {
      const prev = newResults[style];
      if (prev?.previewUrl) {
        revokeExportUrl(prev.previewUrl);
      }

      const result = await runSingleTest(style);
      newResults[style] = result;
      setResults({ ...newResults });

      if (result.success) successCount++;
      else failCount++;
    }

    setBatchRunning(false);
    toast.success(`Batch complete: ${successCount} passed, ${failCount} failed`, {
      id: toastId,
    });
  }, [batchRunning, results, runSingleTest, runningStyle]);

  // 计算统计
  const stats = useMemo(() => {
    const vals = Object.values(results).filter(Boolean) as TestResult[];
    return {
      total: vals.length,
      passed: vals.filter((r) => r.success).length,
      failed: vals.filter((r) => !r.success).length,
      avgTime: vals.length > 0 ? Math.round(vals.reduce((s, r) => s + r.durationMs, 0) / vals.length) : 0,
      totalSize: vals.filter((r) => r.success).reduce((s, r) => s + r.sizeBytes, 0),
    };
  }, [results]);

  return (
    <div className="space-y-6 p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gauge className="size-5" />
            Export Test Panel
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Test SVG-to-Image export across all 6 poster styles
          </p>
        </div>
        <Button
          onClick={handleBatchExport}
          disabled={batchRunning || runningStyle !== null}
          className="gap-2"
        >
          {batchRunning ? <Spinner className="size-4" /> : <Play className="size-4" />}
          {batchRunning ? 'Exporting All...' : 'Batch Export All'}
        </Button>
      </div>

      {/* 统计栏 */}
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.passed}/{STYLE_ORDER.length}</span>
            <span className="text-xs text-muted-foreground">Passed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <span className="text-2xl font-bold text-destructive">{stats.failed}</span>
            <span className="text-xs text-muted-foreground">Failed</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <span className="text-2xl font-bold">{stats.avgTime}ms</span>
            <span className="text-xs text-muted-foreground">Avg Time</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <span className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</span>
            <span className="text-xs text-muted-foreground">Total Size</span>
          </CardContent>
        </Card>
      </div>

      {/* 预览卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_ORDER.map((style) => (
          <div key={style}>
            {/* 隐藏的真实 SVG，用于导出引用 */}
            <div className="absolute -z-10 opacity-0 pointer-events-none" style={{ width: 400, height: 600 }}>
              <TalismanPosterV2
                ref={stableRefs[style] as React.Ref<SVGSVGElement>}
                gua={TEST_GUA}
                talisman={TEST_TALISMAN}
                style={style}
                width={400}
                height={600}
                showDecorations
                showFilters
              />
            </div>
            <StylePreviewCard
              style={style}
              result={results[style]}
              onRun={handleRunSingle}
              running={runningStyle === style}
            />
          </div>
        ))}
      </div>

      {/* 结果表格 */}
      {(stats.total > 0 || batchRunning) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Style</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {STYLE_ORDER.map((style) => {
                  const r = results[style];
                  return (
                    <TableRow key={style}>
                      <TableCell className="font-medium">
                        {POSTER_STYLES[style].labelEn}
                        <div className="text-xs text-muted-foreground">{POSTER_STYLES[style].label}</div>
                      </TableCell>
                      <TableCell>{r ? `${r.durationMs}ms` : '—'}</TableCell>
                      <TableCell>{r ? formatFileSize(r.sizeBytes) : '—'}</TableCell>
                      <TableCell>
                        {r ? (
                          <Badge variant={r.success ? 'default' : 'destructive'}>
                            {r.success ? 'Success' : 'Failed'}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {r?.previewUrl ? (
                          <img
                            src={r.previewUrl}
                            alt={r.styleLabel}
                            className="w-10 h-10 object-contain rounded border bg-muted"
                          />
                        ) : r?.error ? (
                          <ImageOff className="size-5 text-destructive" />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 清理提示 */}
      <p className="text-xs text-muted-foreground text-center">
        Object URLs are automatically revoked on component unmount or new export.
      </p>
    </div>
  );
};

export default ExportTester;
