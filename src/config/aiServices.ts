export interface AIServiceConfig {
  name: string;
  apiKey: string;
  apiEndpoint: string;
  model: string;
  maxTokens: number;
  temperature: number;
  top_p: number;
  top_k: number;
  frequency_penalty: number;
}

export interface AIServices {
  [key: string]: AIServiceConfig | string;
  segmentPromptTemplate: string;
}

export interface SegmentInfo {
  index: number;
  length: number;
  preview: string;
  hasTitle: boolean;
  lines: number;
}

export interface SegmentResult {
  totalSegments: number;
  segments: SegmentInfo[];
}

export interface MergedSegmentResult {
  originalCount: number;
  mergedCount: number;
  segments: Array<{
    index: number;
    length: number;
    preview: string;
  }>;
}

// 将 prompt 模板单独导出
export const segmentPromptTemplate = `你是一个专业的内容分段助手。你的任务是将给定的内容分割成独立的知识卡片。

分段要求：
1. 保持原始内容的完整性和格式
2. 不要添加或修改任何内容
3. 不要添加额外的标题
4. 只在内容自然分段处添加分隔符
5. 每个分段应该是一个完整的知识单元
6. 如果发现重复的内容，只保留一份
7. 保持原有的 HTML 标签和样式类

输出要求：
1. 直接返回分段后的内容，每个卡片用 "---" 分隔
2. 保持原有的 HTML 格式和样式
3. 不要添加任何额外的内容或标题
4. 不要修改原始内容的任何部分
5. 确保每个分段都是有效的 HTML

示例输入：
<div class="template">
  <h1>标题1</h1>
  <p>内容1</p>
  <h1>标题1</h1>
  <p>内容1</p>
</div>

示例输出：
<div class="template">
  <h1>标题1</h1>
  <p>内容1</p>
</div>
---

现在，请将以下内容按照上述要求进行分段，注意去除重复内容：

{content}`;

export const aiServices: { [key: string]: AIServiceConfig } = {
  // 硅基流动
  siliconFlow: {
    name: '硅基流动',
    apiKey: (() => {
      const key = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!key) {
        console.error('环境变量 VITE_SILICON_FLOW_API_KEY 未设置！请检查 .env 文件配置。');
        console.log('当前环境变量:', {
          VITE_SILICON_FLOW_API_KEY: import.meta.env.VITE_SILICON_FLOW_API_KEY,
          NODE_ENV: import.meta.env.MODE,
          BASE_URL: import.meta.env.BASE_URL,
          allEnvVars: Object.keys(import.meta.env)
        });
      }
      return key;
    })(),
    apiEndpoint: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen3-32B',
    maxTokens: 512,
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    frequency_penalty: 0.5
  }
};

// 默认使用硅基流动服务
export const defaultAIService = 'siliconFlow';

// 导出分段结果处理函数
export const processSegmentResult = (content: string): string[] => {
  // 使用 "---" 作为分隔符分割内容
  const segments = content.split('---')
    .map(segment => segment.trim())
    .filter(segment => segment.length > 0);
  
  // 检查分段结果
  const segmentResult: SegmentResult = {
    totalSegments: segments.length,
    segments: segments.map((segment, index) => ({
      index: index + 1,
      length: segment.length,
      preview: segment.slice(0, 100) + '...',
      hasTitle: false, // 不再检查标题
      lines: segment.split('\n').length
    }))
  };
  
  console.log('AI 分段结果处理:', segmentResult);

  // 验证每个分段
  segments.forEach((segment, index) => {
    if (!segment.trim()) {
      console.warn(`警告：第 ${index + 1} 段内容为空`);
    }
  });

  // 如果分段数量过多，尝试合并短段落
  if (segments.length > 6) {
    console.log('分段数量过多，尝试合并短段落');
    const mergedSegments: string[] = [];
    let currentSegment = '';

    for (const segment of segments) {
      // 如果当前段落很短（少于 500 字符）且不是最后一个段落，尝试合并
      if (segment.length < 500 && segments.indexOf(segment) < segments.length - 1) {
        currentSegment += (currentSegment ? '\n\n' : '') + segment;
      } else {
        if (currentSegment) {
          mergedSegments.push(currentSegment + '\n\n' + segment);
          currentSegment = '';
        } else {
          mergedSegments.push(segment);
        }
      }
    }

    if (currentSegment) {
      mergedSegments.push(currentSegment);
    }

    const mergedResult: MergedSegmentResult = {
      originalCount: segments.length,
      mergedCount: mergedSegments.length,
      segments: mergedSegments.map((segment, index) => ({
        index: index + 1,
        length: segment.length,
        preview: segment.slice(0, 100) + '...'
      }))
    };

    console.log('合并后的分段结果:', mergedResult);

    return mergedSegments;
  }

  return segments;
}; 