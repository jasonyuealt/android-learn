/**
 * 高级实战项目
 * 音乐、相册、即时通讯、电商、小游戏
 */

import type { ProjectData } from '@/data/projects/types'

export const advancedProjects: ProjectData[] = [
  {
    id: 'music',
    name: '音乐播放器',
    description: '学习后台服务、媒体播放和通知栏控制',
    iconName: 'Music',
    difficulty: 3,
    tags: ['Service', 'MediaPlayer', '通知', 'ExoPlayer'],
    estimatedHours: 20,
    overview: '音乐播放器是学习 Android Service 的最佳实践项目。你将掌握后台播放、媒体控制、通知栏操作等核心技能。',
    features: [
      '本地音乐扫描',
      '播放/暂停/上下曲',
      '后台播放',
      '通知栏控制',
      '锁屏界面',
      '播放列表'
    ],
    techStack: [
      'Kotlin',
      'Media3 / ExoPlayer',
      'Foreground Service',
      'MediaSession',
      'Notification',
      'ContentResolver'
    ],
    steps: []
  },
  {
    id: 'gallery',
    name: '相册应用',
    description: '处理相机调用、图片选择和运行时权限',
    iconName: 'Camera',
    difficulty: 3,
    tags: ['Camera', '相册', '权限', 'FileProvider'],
    estimatedHours: 14,
    overview: '相册应用帮助你掌握 Android 权限系统、相机调用、图片处理等常见需求。',
    features: [
      '读取本地相册',
      '拍照功能',
      '图片预览',
      '权限请求处理',
      '图片编辑裁剪',
      '分享到其他应用'
    ],
    techStack: [
      'Kotlin',
      'ActivityResult API',
      'FileProvider',
      'Coil / Glide',
      'Permission Handling',
      'CameraX'
    ],
    steps: []
  },
  {
    id: 'chat',
    name: '即时通讯',
    description: '实现用户系统、实时消息和推送通知',
    iconName: 'MessageCircle',
    difficulty: 4,
    tags: ['Firebase', '推送', '实时通信', 'Auth'],
    estimatedHours: 30,
    overview: '即时通讯是综合性最强的项目，涵盖用户认证、实时数据库、云消息推送等后端集成能力。',
    features: [
      '用户注册登录',
      '实时消息收发',
      '消息推送通知',
      '在线状态显示',
      '聊天记录存储',
      '图片消息发送'
    ],
    techStack: [
      'Kotlin',
      'Firebase Auth',
      'Firebase Realtime Database',
      'Firebase Cloud Messaging',
      'Coil',
      'WorkManager'
    ],
    steps: []
  },
  {
    id: 'shop',
    name: '电商应用',
    description: '完整的商城功能，包括支付集成和订单管理',
    iconName: 'ShoppingCart',
    difficulty: 4,
    tags: ['支付', '购物车', '订单', 'REST API'],
    estimatedHours: 40,
    overview: '电商应用是最接近真实工作场景的项目。你将处理商品展示、购物车、订单流程、支付集成等完整业务。',
    features: [
      '商品列表/详情',
      '购物车管理',
      '订单创建/支付',
      '收货地址管理',
      '订单状态追踪',
      '商品搜索筛选'
    ],
    techStack: [
      'Kotlin',
      'Retrofit + OkHttp',
      'Room',
      'Navigation Component',
      '支付宝/微信支付 SDK',
      'Paging 3'
    ],
    steps: []
  },
  {
    id: 'game',
    name: '小游戏',
    description: '自定义绘制、复杂动画和传感器交互',
    iconName: 'Gamepad2',
    difficulty: 5,
    tags: ['Canvas', '动画', '传感器', 'SurfaceView'],
    estimatedHours: 25,
    overview: '小游戏项目帮助你掌握 Android 图形绘制、游戏循环、传感器使用等底层技术。',
    features: [
      '自定义游戏界面',
      '触摸/重力感应控制',
      '碰撞检测',
      '音效播放',
      '分数记录',
      '游戏暂停/继续'
    ],
    techStack: [
      'Kotlin',
      'Canvas / SurfaceView',
      'SensorManager',
      'SoundPool',
      'Handler / Choreographer',
      'SharedPreferences'
    ],
    steps: []
  }
]
