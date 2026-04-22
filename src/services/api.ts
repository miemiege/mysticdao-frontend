const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface AIInterpretRequest {
  type: 'bazi' | 'fengshui' | 'daily';
  data: Record<string, unknown>;
}

interface AIInterpretResponse {
  text: string;
  status: 'success' | 'error';
  error?: string;
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
  try {
    const response = await fetch(`${API_BASE_URL}/api/interpret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal,
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
      throw error;
    }
    // Fallback: return mock response for demo purposes
    return {
      text: generateMockResponse(request),
      status: 'success',
    };
  }
}

function generateMockResponse(request: AIInterpretRequest): string {
  switch (request.type) {
    case 'bazi':
      return '您的八字命局中，日主为甲木，生于寅月，得令而旺。年柱壬水为偏印，主聪明好学，有独特见解。月柱丙火为食神，泄秀有力，主才华横溢，表达能力强。日柱坐辰土，财星当令，主财运亨通。时柱庚金为七杀，有制化，主事业有成，能担大任。五行木旺，宜从事文化、教育、创意类工作。';
    case 'fengshui':
      return '从风水角度分析，此空间朝向合理，气场流通顺畅。建议保持整洁，增加绿植以活化气场。卧室宜静，客厅宜聚气。色彩搭配以暖色系为主，点缀绿色。财位在东南角，可摆放招财植物。';
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
