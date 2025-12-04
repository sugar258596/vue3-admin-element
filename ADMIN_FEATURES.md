# 管理后台新增功能说明

## 功能概述

为 vue-element-plus-admin 管理后台新增了两个核心功能模块：

### 1. 反馈管理 (Feedback Management)
- **路由路径**: `/system/feedback`
- **功能描述**: 管理用户提交的问题反馈
- **主要功能**:
  - 查看反馈列表（支持按状态筛选）
  - 查看反馈详情（包含用户信息、实验室信息、预约信息）
  - 回复用户反馈
  - 更新反馈状态（待处理/已回复/已关闭）
  - 删除反馈（仅管理员）

### 2. 动态管理 (Dynamic Management)
- **路由路径**: `/system/dynamic`
- **功能描述**: 管理平台资讯动态（复用新闻 News 接口）
- **主要功能**:
  - 发布新动态（支持标题、内容、标签、封面图、多图）
  - 编辑动态
  - 查看动态详情（包含浏览量、点赞数）
  - 删除动态

## 文件结构

### 前端文件
```
vue-element-plus-admin/src/
├── api/modules/system/
│   ├── feedback.js          # 反馈 API
│   └── dynamic.js           # 动态 API
├── views/System/
│   ├── Feedback/
│   │   ├── index.vue        # 反馈列表页
│   │   └── components/
│   │       ├── Detail.vue   # 反馈详情
│   │       └── Reply.vue    # 回复表单
│   └── Dynamic/
│       ├── index.vue        # 动态列表页
│       └── components/
│           ├── Detail.vue   # 动态详情
│           └── Write.vue    # 动态编辑表单
└── router/index.js          # 路由配置（已更新）
```

### 后端文件（已更新）
```
egg-server/app/
├── controller/feedback.js   # 新增 updateStatus 和 destroy 方法
├── service/feedback.js      # 新增 updateStatus 和 delete 方法
└── router/feedback.js       # 新增状态更新和删除路由
```

## API 接口

### 反馈管理 API
- `GET /api/feedbacks` - 获取反馈列表
- `GET /api/feedbacks/:id` - 获取反馈详情
- `POST /api/feedbacks/:id/reply` - 回复反馈
- `PATCH /api/feedbacks/:id/status` - 更新反馈状态
- `PATCH /api/feedbacks/:id/close` - 关闭反馈
- `DELETE /api/feedbacks/:id` - 删除反馈

### 动态管理 API（使用 News 接口）
- `GET /api/news` - 获取动态列表
- `GET /api/news/:id` - 获取动态详情
- `POST /api/news` - 创建动态
- `PUT /api/news/:id` - 更新动态
- `DELETE /api/news/:id` - 删除动态

## 数据模型

### 反馈状态
- `0` - 待处理
- `1` - 已回复
- `2` - 已关闭

### 权限要求
- **反馈管理**: 教师及以上可回复和管理，管理员可删除
- **动态管理**: 教师及以上可创建和编辑，管理员可删除

## 使用说明

1. 启动后端服务：`cd egg-server && npm run dev`
2. 启动前端服务：`cd vue-element-plus-admin && npm run dev`
3. 登录管理后台，在左侧菜单"系统管理"下可看到"反馈管理"和"动态管理"两个菜单项
