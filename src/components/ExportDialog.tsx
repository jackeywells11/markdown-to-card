import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { aiSegmentService } from '../services/aiSegmentService';
import { aiServices } from '../config/aiServices';
import { marked } from 'marked';

// ExportDialog.tsx
// 导出弹窗组件，支持将卡片导出为图片、PDF，支持AI分段、内容分页、图片转Base64等
// Props:
//   isOpen: 是否显示弹窗
//   onClose: 关闭弹窗回调
//   previewRef: 预览区域的ref
//   onExport?: (type: 'image' | 'pdf') => Promise<void>;
//   isDarkMode?: boolean;
// 主要逻辑：图片导出、PDF导出、AI分段、内容清理、HTML转Markdown、图片处理等

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  previewRef: React.RefObject<HTMLElement>;
  onExport?: (type: 'image' | 'pdf') => Promise<void>;
  isDarkMode?: boolean;
}

type SplitMode = 'none' | 'auto' | 'manual' | 'ai';

// 添加类型定义
interface PageInfo {
  segmentLength: number;
  pageHTML: string;
  pageHeight: number;
  pageWidth: number;
  hasContent: boolean;
  images: HTMLImageElement[];
  canvas?: HTMLCanvasElement;
  dataUrl?: string;
}

// 分页：按高度拆分内容为多个 div
function splitByHeight(origin: HTMLElement, maxHeight: number): HTMLElement[] {
  const pages: HTMLElement[] = [];
  let current = document.createElement('div');
  current.style.background = 'white';
  let h = 0;
  Array.from(origin.children).forEach(child => {
    const clone = child.cloneNode(true) as HTMLElement;
    current.appendChild(clone);
    h += (child as HTMLElement).offsetHeight || 40;
    if (h > maxHeight) {
      pages.push(current);
      current = document.createElement('div');
      current.style.background = 'white';
      h = 0;
    }
  });
  if (current.children.length > 0) pages.push(current);
  return pages;
}

// 检测内容是否重复
const isDuplicateContent = (content: string, existingContents: string[]): boolean => {
  // 移除空白字符后比较
  const normalizedContent = content.replace(/\s+/g, '').trim();
  return existingContents.some(existing => 
    existing.replace(/\s+/g, '').trim() === normalizedContent
  );
};

// 添加导出函数
const exportSingleImage = async (canvas: HTMLCanvasElement) => {
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'markdown-card.png';
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  await new Promise(resolve => setTimeout(resolve, 500));
};

const exportMultipleImages = async (canvases: HTMLCanvasElement[]) => {
  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `markdown-card-page${i + 1}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, previewRef }) => {
  const [splitMode, setSplitMode] = useState<SplitMode>('none');
  const [selectedAIService, setSelectedAIService] = useState(aiSegmentService.getCurrentService());
  const [maxHeight, setMaxHeight] = useState(800);
  const [isExporting, setIsExporting] = useState(false);
  const [isSegmenting, setIsSegmenting] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<{
    [key: string]: {
      isConnected: boolean;
      lastError?: string;
      metadata?: {
        tokenCount?: number;
        processingTime?: number;
        modelUsed?: string;
      };
    };
  }>({});

  // 测试所有服务的连接状态
  useEffect(() => {
    const testAllServices = async () => {
      const services = aiSegmentService.getAvailableServices();
      const status: typeof serviceStatus = {};
      
      for (const service of services) {
        aiSegmentService.setService(service);
        const result = await aiSegmentService.getServiceStatus();
        status[service] = {
          isConnected: result.isConnected,
          lastError: result.lastError,
          metadata: result.metadata
        };
      }
      
      setServiceStatus(status);
    };
    
    if (isOpen) {
      testAllServices();
    }
  }, [isOpen]);

  // 处理 AI 分段
  const handleAISegment = async (content: string) => {
    try {
      setIsSegmenting(true);
      
      // 检查内容是否为空
      if (!content.trim()) {
        throw new Error('内容为空，无法进行分段');
      }
      
      console.log('原始内容:', content);
      
      // 设置 AI 服务
      aiSegmentService.setService(selectedAIService);
      const result = await aiSegmentService.segment(content);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      if (!result.segments || result.segments.length === 0) {
        throw new Error('AI 分段未返回任何内容');
      }
      
      // 过滤重复内容
      const uniqueSegments: string[] = [];
      result.segments.forEach(segment => {
        if (!isDuplicateContent(segment, uniqueSegments)) {
          uniqueSegments.push(segment);
        }
      });
      
      console.log('AI 分段结果:', {
        totalSegments: uniqueSegments.length,
        segments: uniqueSegments.map((s, i) => ({
          index: i,
          length: s.length,
          preview: s.slice(0, 100) + '...'
        }))
      });
      
      // 更新服务状态
      setServiceStatus(prev => ({
        ...prev,
        [selectedAIService]: {
          isConnected: true,
          metadata: result.metadata
        }
      }));
      
      return uniqueSegments;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '分段失败';
      
      // 更新服务状态
      setServiceStatus(prev => ({
        ...prev,
        [selectedAIService]: {
          isConnected: false,
          lastError: errorMessage
        }
      }));
      
      return [];
    } finally {
      setIsSegmenting(false);
    }
  };

  // 导出图片
  const handleExportImage = async () => {
    try {
      setIsExporting(true);
      
      const previewElement = document.querySelector('.markdown-preview');
      if (!previewElement) {
        throw new Error('未找到预览元素');
      }

      // 获取原始内容
      const originalContent = previewElement.innerHTML;
      console.log('原始内容:', originalContent);

      // 检查内容是否为空
      if (!originalContent.trim()) {
        throw new Error('预览内容为空');
      }

      let pages: PageInfo[] = [];
      
      if (splitMode === 'ai') {
        // AI 分段模式
        console.log('使用 AI 分段模式');
        
        const segments = await handleAISegment(originalContent);
        console.log('AI 分段结果:', segments);
        
        if (!segments || segments.length === 0) {
          throw new Error('AI 分段未返回任何内容');
        }

        // 创建新页面，保持原始样式
        pages = segments.map((segment, index) => {
          const pageDiv = document.createElement('div');
          pageDiv.className = previewElement.className;
          pageDiv.innerHTML = segment;
          
          // 确保页面包含完整的模板样式
          if (!pageDiv.querySelector('.alibaba-template')) {
            const templateWrapper = document.createElement('div');
            templateWrapper.className = 'alibaba-template bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-l-8 border-orange-500';
            templateWrapper.innerHTML = segment;
            pageDiv.innerHTML = '';
            pageDiv.appendChild(templateWrapper);
          }

          const pageInfo: PageInfo = {
            segmentLength: segment.length,
            pageHTML: pageDiv.innerHTML,
            pageHeight: 0,
            pageWidth: 0,
            hasContent: true,
            images: []
          };

          console.log(`AI 分段页面 ${index + 1}:`, pageInfo);
          return pageInfo;
        });
      } else {
        // 自动分段模式
        const content = originalContent;
        const segments = content.split('---').map(s => s.trim()).filter(s => s.length > 0);
        
        pages = segments.map((segment, index) => {
          const pageDiv = document.createElement('div');
          pageDiv.className = previewElement.className;
          
          // 确保每个分段都包含完整的模板样式
          if (!segment.includes('alibaba-template')) {
            const templateWrapper = `<div class="alibaba-template bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-6 border-l-8 border-orange-500">${segment}</div>`;
            pageDiv.innerHTML = templateWrapper;
          } else {
            pageDiv.innerHTML = segment;
          }

          const pageInfo: PageInfo = {
            segmentLength: segment.length,
            pageHTML: pageDiv.innerHTML,
            pageHeight: 0,
            pageWidth: 0,
            hasContent: true,
            images: []
          };

          console.log(`自动分段页面 ${index + 1}:`, pageInfo);
          return pageInfo;
        });
      }

      // 验证页面内容
      if (pages.length === 0) {
        throw new Error('没有可导出的内容');
      }

      console.log(`准备导出 ${pages.length} 页内容`);

      // 导出每一页
      const exportedPages = await Promise.all(
        pages.map(async (page, index) => {
          console.log(`正在导出第 ${index + 1} 页`);
          
          // 创建临时容器
          const container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.top = '-9999px';
          container.style.width = '800px';
          container.innerHTML = page.pageHTML;
          document.body.appendChild(container);

          try {
            // 检查内容
            const contentCheck = {
              innerHTML: container.innerHTML,
              textContent: container.textContent,
              offsetHeight: container.offsetHeight,
              offsetWidth: container.offsetWidth,
              hasContent: container.textContent && container.textContent.trim().length > 0
            };
            console.log(`第 ${index + 1} 页内容检查:`, contentCheck);

            if (!contentCheck.hasContent) {
              throw new Error(`第 ${index + 1} 页内容为空`);
            }

            // 处理图片
            const images = Array.from(container.getElementsByTagName('img'));
            console.log(`第 ${index + 1} 页图片数量:`, images.length);

            await Promise.all(
              images.map(async (img, imgIndex) => {
                if (!img.complete) {
                  await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                  });
                }
                console.log(`第 ${index + 1} 页图片 ${imgIndex + 1} 加载状态:`, {
                  src: img.src,
                  complete: img.complete,
                  naturalWidth: img.naturalWidth,
                  naturalHeight: img.naturalHeight
                });
              })
            );

            // 渲染前检查
            const renderCheck = {
              pageHTML: container.innerHTML,
              pageText: container.textContent,
              pageHeight: container.offsetHeight,
              pageWidth: container.offsetWidth,
              computedStyle: window.getComputedStyle(container)
            };
            console.log(`第 ${index + 1} 页渲染前检查:`, renderCheck);

            // 使用 html2canvas 导出
            const canvas = await html2canvas(container, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff',
              logging: true,
              onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.body.firstChild as HTMLElement;
                console.log('克隆的文档:', {
                  html: clonedDoc.documentElement.outerHTML,
                  body: clonedDoc.body.innerHTML,
                  pageHTML: clonedContainer.innerHTML,
                  pageText: clonedContainer.textContent,
                  pageHeight: clonedContainer.offsetHeight
                });
              }
            });

            const canvasInfo = {
              width: canvas.width,
              height: canvas.height,
              hasContent: canvas.width > 0 && canvas.height > 0,
              toDataURL: canvas.toDataURL('image/png')
            };
            console.log(`第 ${index + 1} 页 canvas 信息:`, canvasInfo);

            if (!canvasInfo.hasContent) {
              throw new Error(`第 ${index + 1} 页渲染失败`);
            }

            return {
              ...page,
              canvas,
              dataUrl: canvasInfo.toDataURL
            };
          } finally {
            document.body.removeChild(container);
          }
        })
      );

      // 导出所有页面
      if (exportedPages.length === 1) {
        // 单页导出
        const page = exportedPages[0];
        if (!page.canvas) {
          throw new Error('导出失败：无法生成图片');
        }
        await exportSingleImage(page.canvas);
      } else {
        // 多页导出
        const validCanvases = exportedPages
          .map(page => page.canvas)
          .filter((canvas): canvas is HTMLCanvasElement => canvas !== undefined);
        
        if (validCanvases.length === 0) {
          throw new Error('导出失败：没有有效的图片内容');
        }
        
        await exportMultipleImages(validCanvases);
      }

      console.log('导出完成');
    } catch (error) {
      console.error('导出图片失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 导出 PDF
  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      setIsExporting(true);
      const node = previewRef.current;
      node.style.background = 'white';
      
      let pages: HTMLElement[] = [];
      const content = node.innerText;
      
      switch (splitMode) {
        case 'ai':
          const segments = await handleAISegment(content);
          pages = await Promise.all(segments.map(async segment => {
            const page = document.createElement('div');
            page.style.background = 'white';
            page.style.padding = '40px';
            page.style.width = '800px';
            page.innerHTML = await marked.parse(segment);
            return page;
          }));
          break;
          
        case 'manual':
          pages = splitByHeight(node, maxHeight);
          break;
          
        case 'auto':
          pages = Array.from(node.children).map(child => {
            const page = document.createElement('div');
            page.style.background = 'white';
            page.style.padding = '40px';
            page.style.width = '800px';
            page.appendChild(child.cloneNode(true));
            return page;
          });
          break;
          
        default:
          pages = [node];
      }
      
      if (pages.length === 0) {
        throw new Error('没有可导出的内容');
      }
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '-9999px';
        container.style.width = '800px';
        container.style.background = 'white';
        container.appendChild(page);
        document.body.appendChild(container);
        
        try {
          const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            logging: true,
            backgroundColor: '#ffffff',
            allowTaint: true,
            foreignObjectRendering: true,
            imageTimeout: 0
          });
          
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const img = new Image();
          img.src = dataUrl;
          
          await new Promise(resolve => {
            img.onload = () => {
              const imgWidth = pdf.internal.pageSize.getWidth();
              const imgHeight = (img.height * imgWidth) / img.width;
              
              if (i > 0) {
                pdf.addPage();
              }
              
              pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
              resolve(null);
            };
          });
          
          await new Promise(resolve => setTimeout(resolve, 100));
        } finally {
          document.body.removeChild(container);
        }
      }
      
      pdf.save('markdown-card.pdf');
      node.style.background = '';
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      alert(error instanceof Error ? error.message : '导出 PDF 失败');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">导出卡片</h2>
        
        <div className="space-y-4">
          {/* 分页方式选择 */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-900 dark:text-white">
              分页方式
            </label>
            <select
              value={splitMode}
              onChange={(e) => setSplitMode(e.target.value as SplitMode)}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="none">不分页</option>
              <option value="auto">自动分页（按内容分段）</option>
              <option value="manual">手动分页（按高度）</option>
              <option value="ai">AI 智能分段</option>
            </select>
          </div>

          {/* AI 服务选择 */}
          {splitMode === 'ai' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm text-gray-900 dark:text-white">
                  AI 服务选择
                </label>
                <button
                  onClick={() => {
                    const service = selectedAIService;
                    aiSegmentService.setService(service);
                    aiSegmentService.testConnection().then(isConnected => {
                      setServiceStatus(prev => ({
                        ...prev,
                        [service]: {
                          isConnected,
                          lastError: isConnected ? undefined : '连接测试失败'
                        }
                      }));
                    });
                  }}
                  disabled={isSegmenting}
                  className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                >
                  {isSegmenting ? '测试中...' : '测试连接'}
                </button>
              </div>
              
              <select
                value={selectedAIService}
                onChange={(e) => setSelectedAIService(e.target.value)}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {aiSegmentService.getAvailableServices().map(service => (
                  <option key={service} value={service}>
                    {aiServices[service as keyof typeof aiServices].name}
                    {serviceStatus[service] && 
                      ` (${serviceStatus[service].isConnected ? '已连接' : '未连接'})`}
                  </option>
                ))}
              </select>
              
              {serviceStatus[selectedAIService]?.lastError && (
                <div className="text-sm text-red-500">
                  错误: {serviceStatus[selectedAIService].lastError}
                </div>
              )}
              
              {serviceStatus[selectedAIService]?.metadata && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div>处理时间: {serviceStatus[selectedAIService].metadata.processingTime}ms</div>
                  {serviceStatus[selectedAIService].metadata.tokenCount && (
                    <div>Token 数: {serviceStatus[selectedAIService].metadata.tokenCount}</div>
                  )}
                  {serviceStatus[selectedAIService].metadata.modelUsed && (
                    <div>模型: {serviceStatus[selectedAIService].metadata.modelUsed}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 手动分页高度设置 */}
          {splitMode === 'manual' && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-900 dark:text-white">
                每页最大高度 (px)
              </label>
              <input
                type="number"
                value={maxHeight}
                onChange={(e) => setMaxHeight(Number(e.target.value))}
                min="400"
                max="2000"
                step="100"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}

          {/* 导出按钮 */}
          <div className="flex space-x-2">
            <button
              onClick={handleExportImage}
              disabled={isExporting || isSegmenting}
              className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
                (isExporting || isSegmenting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? '导出中...' : '导出为图片'}
            </button>
            
            <button
              onClick={handleExportPDF}
              disabled={isExporting || isSegmenting}
              className={`flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors ${
                (isExporting || isSegmenting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? '导出中...' : '导出为 PDF'}
            </button>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog; 