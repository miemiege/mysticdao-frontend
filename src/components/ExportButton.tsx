/**
 * ExportButton.tsx — 海报导出按钮组件
 *
 * Features:
 *   - 接收 svgRef 和可选 filename
 *   - 导出中显示 Loading spinner
 *   - 成功/失败 toast 提示（sonner）
 *   - 支持 PNG/JPEG 格式切换
 *   - 支持 scale 选项（1x/2x/3x）
 *   - DropdownMenu 控制面板
 */

import { useState, useCallback } from 'react';
import { Download, Image, FileImage, Settings2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useExportPoster } from '@/hooks/useExportPoster';
import type { ExportOptions } from '@/lib/exportPoster';

export interface ExportButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>;
  filename?: string;
  className?: string;
}

type ExportFormat = 'png' | 'jpeg';
type ExportScale = 1 | 2 | 3;

export function ExportButton({ svgRef, filename = 'talisman-poster', className }: ExportButtonProps) {
  const { loading, exportAndDownload, clear } = useExportPoster();
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<ExportScale>(2);
  const [open, setOpen] = useState(false);

  const handleExport = useCallback(async () => {
    clear();
    const ext = format === 'png' ? 'png' : 'jpg';
    const fullFilename = `${filename}.${ext}`;

    const opts: ExportOptions & { filename: string } = {
      format,
      scale,
      quality: 0.92,
      filename: fullFilename,
    };

    const toastId = toast.loading(`Exporting ${format.toUpperCase()} at ${scale}x...`);

    try {
      await exportAndDownload(svgRef, opts);
      toast.success(`Exported: ${fullFilename}`, {
        id: toastId,
        description: `Scale ${scale}x · Format ${format.toUpperCase()}`,
      });
    } catch (err) {
      toast.error('Export failed', {
        id: toastId,
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }, [clear, exportAndDownload, filename, format, scale, svgRef]);

  return (
    <div className={className}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            disabled={loading}
            onClick={(e) => {
              // 按住 Ctrl/Command 直接导出，否则打开菜单
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setOpen(true);
              }
            }}
          >
            {loading ? <Spinner className="size-4" /> : <Download className="size-4" />}
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Settings2 className="size-4 text-muted-foreground" />
            Export Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Format */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Format</DropdownMenuLabel>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => setFormat('png')}
            >
              <span className="flex items-center gap-2">
                <Image className="size-4" />
                PNG
              </span>
              {format === 'png' && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={() => setFormat('jpeg')}
            >
              <span className="flex items-center gap-2">
                <FileImage className="size-4" />
                JPEG
              </span>
              {format === 'jpeg' && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Scale */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Scale (Retina)</DropdownMenuLabel>
            {[1, 2, 3].map((s) => (
              <DropdownMenuItem
                key={s}
                className="flex items-center justify-between"
                onClick={() => setScale(s as ExportScale)}
              >
                <span>{s}x {s === 2 ? '(Recommended)' : ''}</span>
                {scale === s && <Check className="size-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Export action */}
          <DropdownMenuItem
            className="bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground justify-center font-medium"
            disabled={loading}
            onClick={handleExport}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Exporting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="size-4" />
                Export Now
              </span>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ExportButton;
