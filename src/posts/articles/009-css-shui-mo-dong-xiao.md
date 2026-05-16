---
title: CSS 水墨动效：从毛笔笔触到页面动画
excerpt: 用 CSS 实现水墨风格的页面动效——墨迹扩散、笔触书写、晕染过渡。本文将深入探讨如何通过伪元素、滤镜和动画关键帧复现传统水墨的动态美感。
date: 丙午年 三月廿八
category: 技术札记
subCategory: CSS
tags: [CSS, 动画, 前端]
readingTime: 10
featured: true
type: tech
---
## 前言

水墨动画的美感在于其不可预测性——墨入水中的那一刻，晕染的轨迹千变万化。在前端的世界里，这种"随机感"可以通过 CSS 动画和滤镜来模拟。

本文将从实践角度出发，分享几种纯 CSS 实现的水墨动效方案。

[!NOTE]
本文所有示例均可在现代浏览器中运行。优先使用 CSS 而非 JavaScript 实现，以保证性能和优雅降级。

## 一、墨迹扩散效果

墨迹扩散的核心是"从中心向外渐变"，同时带有不规则的边缘。

### 1.1 径向扩散

```css
.ink-spread {
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle at center,
    var(--ink-black) 0%,
    transparent 70%
  );
  animation: spread 3s ease-out infinite;
  filter: blur(2px);
}

@keyframes spread {
  0% {
    transform: scale(0.3);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
```

### 1.2 不规则边缘

真正的墨迹不会是一个完美的圆。我们可以用伪元素和多个径向渐变叠加来实现不规则轮廓：

| 技巧 | 实现方式 | 兼容性 |
|------|----------|--------|
| 径向渐变叠加 | 多个 radial-gradient 叠加 | 全部 |
| 滤镜模糊 | filter: blur() | 全部 |
| clip-path | 不规则多边形裁剪 | 现代 |
| SVG 滤镜 | feTurbulence 噪波 | 现代 |

[!TIP]
对于生产环境，推荐使用 "径向渐变 + filter: blur" 的组合，性能最优且兼容性最佳。

## 二、笔触书写动画

模拟毛笔在宣纸上写字的视觉效果——笔触由粗到细、边缘半透明。

### 2.1 基础实现

```css
.brush-stroke {
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--ink-black) 20%,
    var(--ink-medium) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: strokeIn 2s ease forwards;
  transform-origin: left center;
}

@keyframes strokeIn {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 0.3;
  }
}
```

## 三、晕染过渡效果

晕染（Ink Bleed）是水墨在宣纸上自然扩散的效果。在 UI 过渡中使用晕染，可以让元素切换变得柔和而富有诗意。

### 3.1 页面切换晕染

```css
.page-transition {
  animation: inkBleed 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes inkBleed {
  0% {
    clip-path: circle(0% at 50% 50%);
    filter: blur(8px);
  }
  100% {
    clip-path: circle(100% at 50% 50%);
    filter: blur(0);
  }
}
```

[!WARNING]
clip-path 动画在移动端 Safari 上可能存在性能问题。建议在移动端降级为透明度过渡。

## 四、性能建议

```css
/* 推荐使用 transform 和 opacity 进行动画 */
.high-perf {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

| 属性 | 是否触发重排 | 推荐 |
|------|-------------|------|
| transform | 否 | ✅ |
| opacity | 否 | ✅ |
| filter | 否 | ✅ |
| clip-path | 否 | ✅ |
| width/height | 是 | ❌ |
| margin/padding | 是 | ❌ |

[!TIP]
在开发水墨动效时，建议始终开启 Chrome DevTools 的 Rendering → Paint flashing，实时检测是否产生了不必要的重绘。

## 总结

CSS 为实现水墨动态美学提供了丰富的工具集：渐变模拟墨色变化、滤镜制造模糊晕染、关键帧驱动扩散过程。更重要的是，这些方案都是在浏览器原生渲染管线中执行的，无需额外引入动画库，性能优异且代码简洁。

未来可以进一步探索的方向：

1. CSS Houdini 自定义 Worklet 实现更真实的墨迹粒子效果
2. Scroll-driven animations 实现滚动触发的水墨过渡
3. 结合 @property 自定义属性实现墨色渐变动画
