// TemplateManager.tsx
// 模板管理弹窗组件，支持新建、保存、删除、应用Markdown模板
// Props:
//   isOpen: 是否显示弹窗
//   onClose: 关闭弹窗回调
//   setMarkdown: 设置Markdown内容回调
//   isDarkMode: 是否为深色模式
// 主要逻辑：模板的本地存储、增删改查、应用模板到编辑器

import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  content: string;
}

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  setMarkdown: (content: string) => void;
  isDarkMode: boolean;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ isOpen, onClose, setMarkdown, isDarkMode }) => {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('templates');
    return saved ? JSON.parse(saved) : [];
  });

  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('templates', JSON.stringify(newTemplates));
  };

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      content: newTemplateContent,
    };

    saveTemplates([...templates, newTemplate]);
    setNewTemplateName('');
    setNewTemplateContent('');
  };

  const handleDeleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const handleUseTemplate = (content: string) => {
    setMarkdown(content);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-xl font-bold mb-4">模板管理</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">新建模板</label>
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="模板名称"
              className={`w-full p-2 rounded border mb-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
            <textarea
              value={newTemplateContent}
              onChange={(e) => setNewTemplateContent(e.target.value)}
              placeholder="模板内容"
              className={`w-full p-2 rounded border h-32 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
            <button
              onClick={handleAddTemplate}
              className={`mt-2 px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              添加模板
            </button>
          </div>

          <div>
            <h3 className="font-bold mb-2">已保存的模板</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{template.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUseTemplate(template.content)}
                      className={`px-3 py-1 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      使用
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className={`px-3 py-1 rounded ${isDarkMode ? 'bg-red-700 hover:bg-red-600' : 'bg-red-200 hover:bg-red-300'}`}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager; 