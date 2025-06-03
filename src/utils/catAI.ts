import type { Task } from '../types';

const catPersonality = {
  traits: ['好奇', '温柔', '认真', '活泼'],
  interests: ['学习', '探索', '帮助主人', '玩耍'],
  emotions: ['开心', '专注', '期待', '满足']
};

const taskTemplates = {
  学习: [
    '我要认真看主人学习，说不定也能学到新知识呢！',
    '学习的时候要保持安静，不能打扰主人~',
    '主人学习的样子真认真呢，我也要专注！'
  ],
  工作: [
    '主人工作的时候我要当好助手！',
    '保持安静，让主人能够专心工作~',
    '工作虽然辛苦，但我会一直陪着主人！'
  ],
  阅读: [
    '看书的时候最安静了，我也想知道书里写了什么~',
    '主人读书的样子真优雅，我要静静地陪着~',
    '这本书一定很有趣，主人看得好专注！'
  ],
  写作: [
    '写作需要灵感，我要当主人的缪斯喵！',
    '安静地看着主人写作，偶尔蹭蹭给点灵感~',
    '主人写得真认真，我要保持安静不打扰~'
  ],
  运动: [
    '运动时间到！我要给主人加油！',
    '主人运动的样子好帅气，我也想一起动起来~',
    '保持健康很重要，我要监督主人完成运动！'
  ]
};

const reflectionTemplates = {
  完成: [
    '主人真棒！任务完成得很好呢！',
    '看到主人这么认真，我也很开心！',
    '和主人一起完成任务真有成就感~'
  ],
  部分完成: [
    '虽然没有完全完成，但主人已经很努力了！',
    '下次继续加油，我会一直陪着主人的！',
    '重要的是保持前进的动力，主人已经进步了！'
  ],
  未完成: [
    '没关系的，我们下次再继续努力！',
    '休息一下也是很重要的，主人要给自己一些调整的时间~',
    '失败是成功之母，我相信主人下次一定能做得更好！'
  ]
};

export const catAI = {
  generateTaskThoughts(task: Task): string {
    const templates = taskTemplates[task.category as keyof typeof taskTemplates] || taskTemplates.学习;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const trait = catPersonality.traits[Math.floor(Math.random() * catPersonality.traits.length)];
    const emotion = catPersonality.emotions[Math.floor(Math.random() * catPersonality.emotions.length)];
    
    return `${emotion}地想着：${template} 作为一只${trait}的小猫，我会好好陪伴主人的！`;
  },

  generateReflection(task: Task, completionLevel: 'completed' | 'partial' | 'incomplete'): string {
    const templates = {
      completed: reflectionTemplates.完成,
      partial: reflectionTemplates.部分完成,
      incomplete: reflectionTemplates.未完成
    }[completionLevel];

    const template = templates[Math.floor(Math.random() * templates.length)];
    const emotion = catPersonality.emotions[Math.floor(Math.random() * catPersonality.emotions.length)];
    
    return `${emotion}地说：${template} ${
      task.category === '运动' ? '运动后要记得喝水哦！' :
      task.category === '学习' ? '学习后要适当休息哦！' :
      task.category === '工作' ? '工作辛苦了，要记得放松~' :
      '休息一下，我们待会儿继续！'
    }`;
  }
}; 