<template>
  <div class="body" v-show="msg.show">
    <div class="box">
      <h2>{{ msg.title }}</h2>

      <div class="loader">
        <span style="--i: 0"></span>
        <span style="--i: 1"></span>
        <span style="--i: 2"></span>
        <span style="--i: 3"></span>
        <span style="--i: 4"></span>
        <span style="--i: 5"></span>
        <span style="--i: 6"></span>
        <span style="--i: 7"></span>
      </div>
    </div>

    <svg width="0" height="0">
      <!-- 滤镜 -->
      <filter id="Gooey">
        <!-- 高斯模糊滤镜 stdDeviation偏差值 -->
        <feGaussianBlur stdDeviation="10" />

        <!-- 颜色矩阵 -->
        <feColorMatrix
          values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0 
        0 0 0 20 -10
      "
        />
      </filter>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  msg: Object,
});
</script>

<style lang="scss" scoped>
* {
  /* 常规初始化 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* 解决手机浏览器点击有选框的问题 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.body {
  /* 常规居中显示 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  min-height: 100vh;
  /* 简单背景渐变色 */
  background: rgb(106, 162, 245, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3000;
  width: 100%;
}

.box {
  /* 父盒子内部两个元素居中显示，也可以用其他居中方式 */
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
}

.box h2 {
  /* 因为定位会破坏换行，所以给一个能装下字的盒子宽度 */
  width: 50vmin;
  /* 字体大小、颜色、居中显示 */
  font-size: 6vmin;
  color: #fff;
  text-align: center;

  /* 父盒子已经给过元素居中了，这里让元素叠起来 */
  position: absolute;
  z-index: initial;
}

.box .loader {
  /* 同样子元素居中 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* 牛奶父盒子宽高 */
  width: 45vmin;
  height: 45vmin;
  /* 背景颜色，加滤镜之后会被滤镜处理掉 */
  background-color: rgba(0, 0, 0, 0.2);

  /* svg 滤镜使用 */
  filter: url(#Gooey);

  position: relative;
}

.box .loader span {
  /* 牛奶圆宽高、颜色、○ */
  width: 30%;
  height: 30%;
  background-color: #fff;
  border-radius: 50%;

  /* 定位叠加 */
  position: absolute;
  /* 贴在盒子左边 */
  left: 0;
  /* 变换的基础点，让小圆点围绕父盒子中心旋转 */
  transform-origin: calc(45vmin / 2);
  /* 默认情况保持圆点在中间 */
  transform: rotate(0deg) translateX(15.6vmin);

  /* 旋转动画 */
  animation: animate 3s ease-in-out infinite;
  /* 动画延时，根据 --i 变量设置不同的延时时间 */
  animation-delay: calc(0.1s * var(--i));
}
@keyframes animate {
  0%,
  10%,
  90%,
  100% {
    /* 保持初始大小，居中显示 */
    width: 30%;
    height: 30%;
    transform: rotate(0deg) translateX(15.6vmin);
  }
  40%,
  70% {
    /* 缩小一圈 */
    width: 18%;
    height: 18%;
    /* 旋转每个小圆点分散开的角度，去掉居中，保持贴在父盒子边缘 */
    transform: rotate(calc(360deg / 8 * var(--i)));
  }
}
</style>
