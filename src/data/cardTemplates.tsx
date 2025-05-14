import { CardTemplate } from '../types/template';

export const cardTemplates: CardTemplate[] = [
  {
    id: 'apple-note',
    name: '苹果备忘录',
    render: (content) => (
      <div style={{
        background: '#fffbe6',
        borderRadius: 16,
        boxShadow: '0 4px 24px #e0c97f55',
        padding: 24,
        fontFamily: 'San Francisco, Arial, sans-serif',
        color: '#333',
        border: '1px solid #f5e1a4',
        width: 360,
        minHeight: 220,
        margin: '0 auto'
      }}>
        <div style={{fontWeight: 700, fontSize: 18, marginBottom: 8}}>无标题</div>
        <div dangerouslySetInnerHTML={{__html: content}} />
        <div style={{fontSize: 12, color: '#bfae7e', marginTop: 16, textAlign: 'right'}}>
          ''
        </div>
      </div>
    ),
    content: '这里是苹果备忘录风格的卡片内容示例。',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01'
  },
  {
    id: 'notebook',
    name: '线圈笔记本',
    render: (content) => (
      <div style={{
        background: '#f7f7f7',
        borderRadius: 12,
        boxShadow: '0 2px 12px #bbb5',
        padding: 24,
        fontFamily: 'Noteworthy, Arial, sans-serif',
        color: '#222',
        borderLeft: '8px solid #8e8e8e',
        borderRight: '8px solid #8e8e8e',
        width: 360,
        minHeight: 220,
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', 
          left: -16, 
          top: 24, 
          width: 8, 
          height: 120, 
          background: 'repeating-linear-gradient(#ccc, #ccc 2px, transparent 2px, transparent 10px)'
        }} />
        <div style={{fontWeight: 700, fontSize: 18, marginBottom: 8}}>无标题</div>
        <div dangerouslySetInnerHTML={{__html: content}} />
        <div style={{fontSize: 12, color: '#888', marginTop: 16, textAlign: 'right'}}>
          ''
        </div>
      </div>
    ),
    content: '这里是线圈笔记本风格的卡片内容示例。',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01'
  },
  {
    id: 'pop-art',
    name: '波普艺术',
    render: (content) => (
      <div style={{
        background: 'linear-gradient(135deg, #ffeb3b 60%, #e91e63 100%)',
        borderRadius: 20,
        boxShadow: '0 6px 32px #e91e6355',
        padding: 24,
        fontFamily: 'Comic Sans MS, Arial, sans-serif',
        color: '#222',
        border: '4px dotted #222',
        width: 360,
        minHeight: 220,
        margin: '0 auto'
      }}>
        <div style={{fontWeight: 900, fontSize: 20, marginBottom: 8, color: '#e91e63'}}>无标题</div>
        <div dangerouslySetInnerHTML={{__html: content}} />
        <div style={{fontSize: 12, color: '#222', marginTop: 16, textAlign: 'right'}}>
          ''
        </div>
      </div>
    ),
    content: '这里是波普艺术风格的卡片内容示例。',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01'
  },
  {
    id: 'glass-morphism',
    name: '玻璃拟态',
    render: (content) => (
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        color: '#2c3e50',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        width: 360,
        minHeight: 220,
        margin: '0 auto'
      }}>
        <div style={{fontWeight: 600, fontSize: 20, marginBottom: 12, color: '#1a365d'}}>无标题</div>
        <div dangerouslySetInnerHTML={{__html: content}} />
        <div style={{fontSize: 12, color: '#4a5568', marginTop: 16, textAlign: 'right'}}>
          ''
        </div>
      </div>
    ),
    content: '这里是玻璃拟态风格的卡片内容示例。',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01'
  },
  {
    id: 'warm-soft',
    name: '温暖柔和',
    render: (content) => (
      <div style={{
        background: '#fff5f5',
        borderRadius: 16,
        boxShadow: '0 4px 20px #fed7d755',
        padding: 24,
        fontFamily: 'Georgia, serif',
        color: '#4a5568',
        border: '1px solid #fed7d7',
        width: 360,
        minHeight: 220,
        margin: '0 auto'
      }}>
        <div style={{fontWeight: 600, fontSize: 18, marginBottom: 8, color: '#c53030'}}>无标题</div>
        <div dangerouslySetInnerHTML={{__html: content}} />
        <div style={{fontSize: 12, color: '#a0aec0', marginTop: 16, textAlign: 'right'}}>
          ''
        </div>
      </div>
    ),
    content: '这里是温暖柔和风格的卡片内容示例。',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01'
  }
]; 