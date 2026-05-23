const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mysticdao-backend.onrender.com';

import { getPreloadedData } from '../hooks/usePreload';

interface AIInterpretRequest {
  type: 'bazi' | 'fengshui' | 'daily';
  data: Record<string, unknown>;
}

interface AIInterpretResponse {
  text: string;
  status: 'success' | 'error';
  error?: string;
}

type UserPersona = 'newbie' | 'veteran';

export function getUserPersona(): UserPersona {
  try {
    const raw = localStorage.getItem('mysticdao_history');
    if (!raw) return 'newbie';
    const parsed = JSON.parse(raw);
    const count = Array.isArray(parsed)
      ? parsed.length
      : Array.isArray(parsed?.reading_history)
        ? parsed.reading_history.length
        : 0;
    return count >= 3 ? 'veteran' : 'newbie';
  } catch {
    return 'newbie';
  }
}

/**
 * POST-based AI interpretation API.
 * Uses standard POST request and returns full text.
 * Frontend handles typewriter effect display.
 */
export async function fetchAIInterpretation(
  request: AIInterpretRequest,
  signal?: AbortSignal
): Promise<AIInterpretResponse> {
  // 5秒超时：Render免费版冷启动约10-30秒，超时后立即使用本地降级
  const TIMEOUT_MS = 5000;
  const timeoutSignal = signal
    ? signal
    : AbortSignal.timeout(TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: timeoutSignal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || data.content || data.message || '',
      status: 'success',
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      // 超时或主动取消：返回本地降级内容，不抛错
      const text = await fetchFromJSON(request);
      return {
        text,
        status: 'success',
        // 标记为降级内容，前端可选择性提示"AI通道繁忙，已切换本地解读"
      };
    }
    // 其他错误同样降级
    const text = await fetchFromJSON(request);
    return {
      text,
      status: 'success',
    };
  }
}

async function fetchFromJSON(request: AIInterpretRequest): Promise<string> {
  const persona = getUserPersona();

  try {
    if (request.type === 'daily') {
      const preloaded = getPreloadedData<unknown[]>('daily');
      const data = preloaded ?? (await fetch('./data/content.json').then((r) => r.json()));
      const items = (data ?? []).filter(
        (d: any) => d.content_type === 'daily-energy' && d.language === 'zh' && !d.body.includes('API错误')
      );
      if (items.length > 0) {
        return items[Math.floor(Math.random() * items.length)].body;
      }
    } else if (request.type === 'bazi') {
      const preloaded = getPreloadedData<unknown[]>('bazi');
      const data = preloaded ?? (await fetch('./data/bazi.json').then((r) => r.json()));
      if (data && data.length > 0) {
        const item = data[Math.floor(Math.random() * data.length)] as any;
        return item.ai_interpretation || generateMockResponse(request, persona);
      }
    } else if (request.type === 'fengshui') {
      const preloaded = getPreloadedData<unknown[]>('fengshui');
      const data = preloaded ?? (await fetch('./data/fengshui.json').then((r) => r.json()));
      if (data && data.length > 0) {
        const item = data[Math.floor(Math.random() * data.length)] as any;
        return item.ai_interpretation || generateMockResponse(request, persona);
      }
    }
  } catch {
    // ignore and fallback to mock
  }
  return generateMockResponse(request, persona);
}

function generateMockResponse(request: AIInterpretRequest, persona: UserPersona = 'newbie'): string {
  let text = '';
  switch (request.type) {
    case 'bazi':
      text = '您的八字命局中，日主为甲木，生于寅月，得令而旺。年柱壬水为偏印，主聪明好学，有独特见解。月柱丙火为食神，泄秀有力，主才华横溢，表达能力强。日柱坐辰土，财星当令，主财运亨通。时柱庚金为七杀，有制化，主事业有成，能担大任。五行木旺，宜从事文化、教育、创意类工作。';
      if (persona === 'newbie') {
        return '【命理解读】日主就是代表你的天干，好比你的灵魂星座。\n\n' + text;
      }
      return '【命理解读】又是熟悉的命盘。你之前的解读提到喜用神的方向，这次流年会进一步验证...\n\n' + text;
    case 'fengshui':
      text = '从风水角度分析，此空间朝向合理，气场流通顺畅。建议保持整洁，增加绿植以活化气场。卧室宜静，客厅宜聚气。色彩搭配以暖色系为主，点缀绿色。财位在东南角，可摆放招财植物。';
      if (persona === 'newbie') {
        return '【风水解读】风水不是迷信，是环境心理学。\n\n' + text;
      }
      return '【风水解读】你最近调整过家居布局吗？这次分析会结合上次的空间建议...\n\n' + text;
    case 'daily':
      return '今日运势：平稳中带有小惊喜。事业上可能遇到新的机会，建议保持开放的心态。人际关系方面，与朋友的互动会带来意外的收获。财运平稳，不宜大额投资。健康方面注意休息，保持良好的作息习惯。今日幸运数字：7。';
    default:
      return 'AI解读服务暂时不可用，请稍后重试。';
  }
}

/**
 * Simulated streaming-like text delivery using a generator.
 * Yields characters one at a time to simulate typewriter effect.
 */
export async function* streamAIInterpretation(
  request: AIInterpretRequest,
  signal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  const response = await fetchAIInterpretation(request, signal);
  const text = response.text;

  for (let i = 0; i < text.length; i++) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    await new Promise((resolve) => setTimeout(resolve, 30));
    yield text[i];
  }
}
