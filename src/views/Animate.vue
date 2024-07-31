<template>
  <div class="relative">
    <div class="heartBeat a">心跳效果</div>
    <div class="heart fadeout" />
  </div>
</template>

<script setup lang="ts"></script>

<style>
.heart {
  position: relative;
  width: 100px;
  height: 90px;
  margin: 90px 50px;
  float: left;
}

.heart::before,
.heart::after {
  content: '';
  position: absolute;
  top: 40px;
  width: 52px;
  height: 80px;
  border-radius: 50px 50px 0 0;
}

.heart::before {
  left: 50px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
  border-top: 1px solid #eebbc3;
  border-left: 1px solid #eebbc3;
}
.heart::after {
  left: 0;
  transform: rotate(45deg);
  transform-origin: 100% 100%;
  border-top: 1px solid #eebbc3;
  border-right: 1px solid #eebbc3;
}

.a {
  background-color: #eebbc3;
  margin: 0 auto;
}

@keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  45% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  80% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes fadeout {
  0% {
    opacity: 0;
  }
  80% {
    opacity: 0;
  }
  81% {
    opacity: 1;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
  }
}

.heartBeat {
  -webkit-animation-name: heartBeat;
  animation-name: heartBeat;
  animation-iteration-count: infinite;
  -webkit-animation-duration: calc(1s);
  animation-duration: calc(1s);
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}

.fadeout {
  -webkit-animation-name: fadeout;
  animation-name: fadeout;
  animation-iteration-count: infinite;
  -webkit-animation-duration: calc(1s);
  animation-duration: calc(1s);
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
}
</style>
