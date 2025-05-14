import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

// fileOperations.ts
// 文件操作工具函数，支持新建、打开、保存Markdown文件，图片上传，导出图片/PDF等
// createNewFile: 新建Markdown内容
// openFile: 打开本地Markdown文件
// saveFile: 保存Markdown内容到本地
// uploadImage: 上传图片（返回base64）
// exportAsImage: 导出指定元素为图片
// exportAsPDF: 导出指定元素为PDF

export const createNewFile = (): string => {
  return '# 新文档\n\n开始编写你的文档吧！';
};

export const openFile = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('未选择文件'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    };

    input.click();
  });
};

export const saveFile = async (content: string): Promise<void> => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `markdown-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const uploadImage = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('未选择图片'));
        return;
      }

      try {
        // 这里可以替换为实际的图片上传服务
        // 目前使用 base64 作为示例
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('读取图片失败'));
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    };

    input.click();
  });
};

interface ExportOptions {
  scale?: number;
  quality?: number;
  format?: 'png' | 'jpeg';
  backgroundColor?: string;
  margin?: number;
  filename?: string;
}

export const exportAsImage = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    scale = 2,
    quality = 0.98,
    format = 'png',
    backgroundColor = '#ffffff',
    filename = `markdown-${new Date().toISOString().slice(0, 10)}.${format}`
  } = options;

  try {
    // 等待所有图片加载完成
    const images = element.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          })
      )
    );

    // 使用 html2canvas 捕获内容
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor,
      allowTaint: true,
      foreignObjectRendering: true,
      imageTimeout: 0,
      removeContainer: true,
      onclone: (clonedDoc) => {
        // 确保所有图片都已加载
        const images = clonedDoc.getElementsByTagName('img');
        return Promise.all(
          Array.from(images).map(
            (img) =>
              new Promise((resolve) => {
                if (img.complete) {
                  resolve(null);
                } else {
                  img.onload = () => resolve(null);
                  img.onerror = () => resolve(null);
                }
              })
          )
        );
      },
    });

    // 转换为图片并下载
    const url = canvas.toDataURL(`image/${format}`, quality);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('导出图片失败:', error);
    throw new Error('导出图片失败，请重试');
  }
};

interface PDFOptions {
  margin?: number;
  filename?: string;
  image?: {
    type?: 'jpeg' | 'png';
    quality?: number;
  };
  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
  };
  jsPDF?: {
    unit?: 'pt' | 'mm' | 'cm' | 'in';
    format?: 'a3' | 'a4' | 'a5' | 'letter' | 'legal';
    orientation?: 'portrait' | 'landscape';
  };
}

export const exportAsPDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    margin = 1,
    filename = `markdown-${new Date().toISOString().slice(0, 10)}.pdf`,
    image = { type: 'jpeg', quality: 0.98 },
    html2canvas: html2canvasOptions = { scale: 2, useCORS: true, logging: false },
    jsPDF: jsPDFOptions = { unit: 'in', format: 'a4', orientation: 'portrait' }
  } = options;

  try {
    // 等待所有图片加载完成
    const images = element.getElementsByTagName('img');
    await Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          })
      )
    );

    // 配置 PDF 选项
    const opt = {
      margin,
      filename,
      image,
      html2canvas: {
        ...html2canvasOptions,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        imageTimeout: 0,
      },
      jsPDF: jsPDFOptions
    };

    // 导出 PDF
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('导出 PDF 失败:', error);
    throw new Error('导出 PDF 失败，请重试');
  }
}; 