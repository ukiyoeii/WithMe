import type { Character } from '../types';

export interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
  personality: {
    traits: string[];
    interests: string[];
    emotions: string[];
  };
  taskTemplates: {
    [key: string]: {
      content: string;
      type: '创意' | '工作' | '学习' | '家务' | '娱乐';
      progressTypes: ('coding' | 'writing' | 'reading' | 'thinking' | 'testing' | 'debugging' | 'planning')[];
    }[];
  };
  progressReports: {
    [key: string]: string[];
  };
  reflectionTemplates: {
    completed: string[];
    partial: string[];
    incomplete: string[];
  };
  tasks: string[];
}

const programmingTasks = [
  '编写新的功能模块',
  '重构旧代码',
  '修复Bug',
  '写单元测试',
  '代码审查',
  '优化性能',
  '学习新技术',
  '写技术文档'
]

const writingTasks = [
  '写一篇博客文章',
  '编辑文稿',
  '构思新故事',
  '修改文章结构',
  '校对文章',
  '写读书笔记',
  '整理写作素材',
  '翻译文章'
]

export const characters: Record<string, Character> = {
  programmingCat: {
    id: 'programmingCat',
    name: '程序猫',
    emoji: '🐱',
    description: '一只热爱编程的小猫，擅长解决各种技术问题',
    personality: {
      traits: ['专注', '逻辑', '创新', '好奇'],
      interests: ['编程', '算法', '调试', '学习新技术'],
      emotions: ['兴奋', '专注', '思考', '满足']
    },
    taskTemplates: {
      coding: [
        {
          content: '写一个新的功能模块',
          type: '工作',
          progressTypes: ['planning', 'coding', 'testing']
        },
        {
          content: '重构旧代码',
          type: '工作',
          progressTypes: ['reading', 'thinking', 'coding']
        },
        {
          content: '修复Bug',
          type: '工作',
          progressTypes: ['debugging', 'testing', 'coding']
        }
      ],
      learning: [
        {
          content: '学习新的编程语言',
          type: '学习',
          progressTypes: ['reading', 'coding', 'testing']
        },
        {
          content: '研究新框架',
          type: '学习',
          progressTypes: ['reading', 'thinking', 'coding']
        }
      ],
      creative: [
        {
          content: '设计新的算法',
          type: '创意',
          progressTypes: ['thinking', 'coding', 'testing']
        },
        {
          content: '优化性能',
          type: '创意',
          progressTypes: ['thinking', 'coding', 'testing']
        }
      ]
    },
    tasks: programmingTasks,
    progressReports: {
      thinking: [
        '让我想想今天要做什么...',
        '正在规划今天的编程任务...',
        '查看待办清单中...'
      ],
      working: [
        '专注写代码中...',
        '调试这段代码...',
        '思考最佳实现方式...',
        '测试新功能...'
      ],
      reflecting: [
        '代码质量不错！',
        '这个功能实现得很优雅',
        '找到了一个更好的解决方案'
      ]
    },
    reflectionTemplates: {
      completed: [
        '完成了今天的编程任务！代码质量很不错',
        '按计划完成了功能开发，测试通过了',
        '今天的代码写得很顺利，学到了新知识'
      ],
      partial: [
        '遇到了一些技术难题，但在努力解决',
        '完成了部分功能，明天继续加油',
        '今天的任务有点具有挑战性，需要更多思考'
      ]
    }
  },
  writingDog: {
    id: 'writingDog',
    name: '写作狗',
    emoji: '🐕',
    description: '一只热爱写作的小狗，擅长创意和文字表达',
    personality: {
      traits: ['富有想象力', '细心', '感性', '活力'],
      interests: ['写作', '阅读', '观察', '讲故事'],
      emotions: ['灵感迸发', '沉思', '愉悦', '专注']
    },
    taskTemplates: {
      writing: [
        {
          content: '写一篇文章',
          type: '创意',
          progressTypes: ['thinking', 'writing', 'reading']
        },
        {
          content: '修改文稿',
          type: '工作',
          progressTypes: ['reading', 'thinking', 'writing']
        }
      ],
      creative: [
        {
          content: '构思新故事',
          type: '创意',
          progressTypes: ['thinking', 'writing', 'reading']
        },
        {
          content: '设计角色',
          type: '创意',
          progressTypes: ['thinking', 'writing']
        }
      ],
      research: [
        {
          content: '收集素材',
          type: '工作',
          progressTypes: ['reading', 'thinking', 'writing']
        },
        {
          content: '整理资料',
          type: '工作',
          progressTypes: ['reading', 'writing']
        }
      ]
    },
    tasks: writingTasks,
    progressReports: {
      thinking: [
        '在构思新的写作主题...',
        '整理今天的写作计划...',
        '翻阅资料获取灵感...'
      ],
      working: [
        '专注写作中...',
        '修改文章结构...',
        '润色文字...',
        '检查文章逻辑...'
      ],
      reflecting: [
        '这段写得很流畅！',
        '故事情节安排得不错',
        '找到了更好的表达方式'
      ]
    },
    reflectionTemplates: {
      completed: [
        '今天的写作目标达成了！文章很有感染力',
        '按计划完成了文章，结构很清晰',
        '写作状态很好，产出了优质内容'
      ],
      partial: [
        '遇到了一些写作瓶颈，但在突破中',
        '完成了部分内容，需要继续打磨',
        '今天的写作有点卡壳，需要调整状态'
      ]
    }
  }
}; 