import Vue from 'vue';
import App from './Root';
import router from './router';
import ElementUI from 'element-ui';
import '../styls/comm.css';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
new Vue({
    el: '#root',
    router,
    template: '<App/>',
    components: { App }
});
