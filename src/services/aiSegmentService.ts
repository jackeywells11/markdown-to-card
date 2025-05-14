// aiSegmentService.ts
// AI分段服务，负责调用AI接口对内容进行智能分段、去重、连接测试等
// AISegmentService: 单例类，管理AI服务配置、分段、去重、连接测试等
// aiSegmentService: 单例导出实例

import {
  AIServiceConfig,
  aiServices,
  defaultAIService,
  segmentPromptTemplate,
  processSegmentResult
} from '../config/aiServices';

interface ServiceStatus {
  isConnected: boolean;
  lastError?: string;
  metadata?: {
    tokenCount?: number;
    processingTime?: number;
    modelUsed?: string;
  };
}

interface SegmentResponse {
  segments: string[];
  error?: string;
  metadata?: {
    tokenCount?: number;
    processingTime?: number;
    modelUsed?: string;
  };
}

class AISegmentService {
  private static instance: AISegmentService;
  private config: AIServiceConfig;
  private currentService: string;
  private serviceStatus: { [key: string]: ServiceStatus } = {};

  private constructor() {
    this.currentService = defaultAIService;
    const serviceConfig = aiServices[this.currentService];
    if (typeof serviceConfig === 'string') {
      throw new Error(`服务配置 ${this.currentService} 无效`);
    }
    this.config = serviceConfig;
  }

  public static getInstance(): AISegmentService {
    if (!AISegmentService.instance) {
      AISegmentService.instance = new AISegmentService();
    }
    return AISegmentService.instance;
  }

  getCurrentService(): string {
    return this.currentService;
  }

  setService(serviceName: string): void {
    const serviceConfig = aiServices[serviceName];
    if (typeof serviceConfig === 'string') {
      throw new Error(`服务配置 ${serviceName} 无效`);
    }
    this.currentService = serviceName;
    this.config = serviceConfig;
  }

  getAvailableServices(): string[] {
    // 过滤掉非服务配置的属性（如 segmentPromptTemplate）
    return Object.keys(aiServices).filter(key => 
      typeof aiServices[key] === 'object' && 
      'apiKey' in (aiServices[key] as AIServiceConfig)
    );
  }

  private async callAIService(content: string): Promise<string> {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: content
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          top_p: this.config.top_p,
          top_k: this.config.top_k,
          frequency_penalty: this.config.frequency_penalty
        })
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('硅基流动 API 原始响应:', data);

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('API 响应格式错误');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('调用 AI 服务失败:', error);
      throw error;
    }
  }

  async segment(content: string): Promise<SegmentResponse> {
    try {
      const startTime = Date.now();
      const segments = await this.segmentContent(content);
      const processingTime = Date.now() - startTime;

      return {
        segments,
        metadata: {
          processingTime,
          modelUsed: this.config.model
        }
      };
    } catch (error) {
      return {
        segments: [],
        error: error instanceof Error ? error.message : '分段失败',
        metadata: {
          modelUsed: this.config.model
        }
      };
    }
  }

  private async segmentContent(content: string): Promise<string[]> {
    try {
      // 移除重复内容
      const uniqueContent = this.removeDuplicateContent(content);
      console.log('去重后的内容:', uniqueContent);

      const prompt = segmentPromptTemplate.replace('{content}', uniqueContent);
      console.log('发送到 AI 服务的提示:', prompt);
      
      const response = await this.callAIService(prompt);
      console.log('AI 服务返回的原始响应:', response);
      
      // 如果响应为空或无效，直接返回原始内容作为单个分段
      if (!response || !response.trim()) {
        console.warn('AI 服务返回空响应，使用原始内容作为单个分段');
        return [uniqueContent];
      }

      // 使用新的分段处理函数
      const segments = processSegmentResult(response);
      console.log('处理后的分段结果:', segments);
      
      // 验证分段结果
      if (segments.length === 0) {
        console.warn('分段结果为空，使用原始内容作为单个分段');
        return [uniqueContent];
      }

      // 确保每个分段都包含完整的模板样式
      return segments.map((segment: string) => {
        // 如果分段不包含模板类名，添加模板包装
        if (!segment.includes('alibaba-template')) {
          const templateWrapper = `<div class="alibaba-template bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-l-8 border-orange-500">${segment}</div>`;
          return templateWrapper;
        }
        return segment;
      });
    } catch (error) {
      console.error('分段内容处理失败:', error);
      // 发生错误时返回原始内容作为单个分段
      return [content];
    }
  }

  // 添加去重方法
  private removeDuplicateContent(content: string): string {
    // 使用正则表达式匹配完整的卡片内容
    const cardPattern = /<div class="alibaba-template[^>]*>[\s\S]*?<\/div>/g;
    const cards = content.match(cardPattern) || [];
    
    // 使用 Set 去重
    const uniqueCards = Array.from(new Set(cards));
    
    // 如果去重后没有内容，返回原始内容
    if (uniqueCards.length === 0) {
      return content;
    }
    
    // 返回去重后的内容
    return uniqueCards.join('\n');
  }

  async testConnection(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 10
        })
      });

      const isConnected = response.ok;
      const processingTime = Date.now() - startTime;

      this.serviceStatus[this.currentService] = {
        isConnected,
        lastError: isConnected ? undefined : `连接测试失败: ${response.status} ${response.statusText}`,
        metadata: {
          processingTime,
          modelUsed: this.config.model
        }
      };

      return isConnected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      this.serviceStatus[this.currentService] = {
        isConnected: false,
        lastError: errorMessage
      };
      return false;
    }
  }

  getServiceStatus(): ServiceStatus {
    return this.serviceStatus[this.currentService] || {
      isConnected: false,
      lastError: '未测试连接'
    };
  }
}

// 导出单例实例
export const aiSegmentService = AISegmentService.getInstance(); 