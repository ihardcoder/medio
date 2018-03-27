import '@subway/style/index.scss';
import Vue from 'vue';
import App from './App.vue';

new Vue({
  el: '#app',
  template: '<app></app>',
  components: {
    App
  }
});

window.onload = () => {
  import('./_part.js')
}