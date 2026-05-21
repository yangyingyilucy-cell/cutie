# Cutie — AI Story & Pet Companion

基于 React 的纯前端 AI 聊天、故事生成与宠物养成 Web 应用。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS v4 |
| 状态管理 | Zustand (persist → localStorage) |
| 图标 | Lucide React |
| 部署 | Vercel (零配置) |

## 项目结构

```
src/
├── components/
│   ├── chat/         聊天模块
│   │   ├── ChatView.tsx          聊天主视图
│   │   ├── ChatInput.tsx         消息输入框 (Enter发送/Shift+Enter换行)
│   │   ├── MessageList.tsx       消息列表 (用户/助手气泡)
│   │   └── PersonalitySelector.tsx  性格切换 (下拉 + 上下文菜单)
│   ├── story/        故事生成
│   │   ├── StoryView.tsx         故事主视图 (列表/创作/阅读)
│   │   ├── StoryCreator.tsx      创建故事表单 + 写作风格选择
│   │   ├── ChapterView.tsx       章节展示 + 选项/续写输入
│   │   └── Timeline.tsx          章节时间线侧栏
│   ├── pet/          宠物系统
│   │   ├── PetFloating.tsx       可拖拽悬浮宠物按钮
│   │   └── PetPanel.tsx          宠物状态面板 (属性/互动)
│   ├── settings/     设置
│   │   └── SettingsPanel.tsx     API Key/URL/模型/主题/数据管理
│   ├── layout/       布局
│   │   ├── HomePage.tsx          首页 (聊天/故事入口)
│   │   ├── Layout.tsx            主布局 (侧边栏+内容区)
│   │   └── Sidebar.tsx           侧边栏 (聊天/故事/设置切换)
│   └── ui/           通用组件
│       └── GlassCard.tsx         磨砂玻璃卡片/按钮
├── stores/           Zustand 状态
│   ├── settingsStore.ts         API配置/模型/主题
│   ├── characterStore.ts        角色 (3个内置 + 自定义)
│   ├── chatStore.ts             对话消息/流式状态
│   ├── storyStore.ts            故事/章节/写作风格
│   └── petStore.ts              宠物属性/衰减/互动
├── services/
│   └── api.ts                   OpenAI兼容流式请求 + 选项解析
├── types/
│   └── index.ts                 所有 TypeScript 类型定义
├── utils/
│   ├── storage.ts               localStorage 工具 + 模型获取
│   └── writingStyles.ts         4种写作风格定义
├── App.tsx                       路由 (首页 ↔ 应用)
├── main.tsx                      入口
└── index.css                     Tailwind + 磨砂玻璃 + 调色板
```

## 功能模块

### A. API 设置

- 自定义 API Base URL（支持第三方中转）
- API Key 输入（本地 localStorage 存储）
- 自动 `/v1/models` 拉取模型列表
- 浅色/深色主题切换
- 数据清除（聊天记录/故事/宠物）

### B. 多性格 AI 聊天

- 3 个内置角色：傲娇·LUMA、甜心、冷酷
- 支持自定义添加/编辑/删除角色
- 切换角色时可选择继承上下文或开启新对话
- 流式传输（打字机效果）
- 支持停止生成
- 每条消息关联宠物经验值 (+5 EXP, +3 金币)

### C. 故事生成器

- 一键开局：标题/背景/主角/冲突 + 写作风格
- AI 生成章节，每章末尾提供 3 个发展选项
- 用户选择选项或自行输入发展方向
- 4 种写作风格：青春恋爱、现代日常、古风、18+
- 风格可在章节间随时切换，下次生成生效
- 章节时间线查看
- 故事 JSON 导出

### D. 宠物养成（伯恩山犬）

- 可拖拽悬浮框，位置持久化
- 状态：生命值、饥饿度、清洁度、心情
- 自动衰减（饥饿 5min/点，清洁 8min/点）
- 互动：喂食(-10金币/+30饥饿)、抚摸(+20心情)、洗澡(-20金币/+40清洁)
- 经验/金币：聊天获得(+5 EXP/+3金币)，故事生成获得(+15 EXP/+8金币)
- 等级成长：幼犬→成犬→成熟犬（外观变化）
- 状态异常时红色感叹号提示

### E. 视觉风格

- 磨砂玻璃效果（backdrop-filter）
- 浅色/深色两种模式
- 干枯玫瑰紫调色板
- 16px 圆角组件
- 首页中央双入口 + 侧边栏导航
