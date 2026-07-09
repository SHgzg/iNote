export type Category = {
  slug: string;
  name: string;
  deck: string;
  description: string;
  accent: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: 'private-menu',
    name: '私房菜单',
    deck: '饭桌、味觉与可复现的日常',
    description: '记录家常菜谱、备菜流程、口味调整和那些可以再次做出来的餐桌经验。',
    accent: '#c24e2c',
    image: 'images/covers/menu.svg'
  },
  {
    slug: 'study-notes',
    name: '学习笔记',
    deck: '把复杂问题拆成可复用的笔记',
    description: '整理课程、教程、论文和实践中的关键概念，尽量写成未来自己能快速重读的版本。',
    accent: '#2f7d65',
    image: 'images/covers/study.svg'
  },
  {
    slug: 'reading-notes',
    name: '阅读笔记',
    deck: '从书页里留下具体问题',
    description: '读书摘要、摘录之外的追问、章节结构和延伸阅读，偏向长期可沉淀的阅读记录。',
    accent: '#87643b',
    image: 'images/covers/reading.svg'
  },
  {
    slug: 'essays',
    name: '随笔',
    deck: '没有被项目框住的片段',
    description: '保留一些轻的、流动的记录：生活现场、短句、观察，以及尚未变成系统的想法。',
    accent: '#6a6f3c',
    image: 'images/covers/essay.svg'
  },
  {
    slug: 'thinking',
    name: '思考',
    deck: '对问题的慢处理',
    description: '写判断、困惑和推演过程，不急着下结论，更关注一个想法如何被反复修正。',
    accent: '#446d8f',
    image: 'images/covers/thinking.svg'
  },
  {
    slug: 'professional-learning',
    name: '专业学习',
    deck: '面向能力栈的系统整理',
    description: '围绕专业方向的知识地图、工程实践、方法论复盘和阶段性学习计划。',
    accent: '#815c9a',
    image: 'images/covers/professional.svg'
  },
  {
    slug: 'projects',
    name: '项目记录',
    deck: '把做过的事写清楚',
    description: '记录项目背景、取舍、实现过程、踩坑和复盘，方便回看真实的工程判断。',
    accent: '#9d5b46',
    image: 'images/covers/projects.svg'
  },
  {
    slug: 'tools',
    name: '工具方法',
    deck: '工作流、工具箱与效率实验',
    description: '沉淀命令行、编辑器、自动化、写作系统和信息管理方法。',
    accent: '#3f6f78',
    image: 'images/covers/tools.svg'
  },
  {
    slug: 'life',
    name: '生活观察',
    deck: '看见日常里的纹理',
    description: '关于城市、关系、身体、节奏和经验的小型观察。',
    accent: '#b36b2c',
    image: 'images/covers/life.svg'
  },
  {
    slug: 'media',
    name: '书影音',
    deck: '作品、感受与私人索引',
    description: '电影、播客、音乐、展览和其他作品的短评与主题索引。',
    accent: '#735c7f',
    image: 'images/covers/media.svg'
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
