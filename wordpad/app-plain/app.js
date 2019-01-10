import Vue from 'vue';
import App from './Root';
import router from './router';
import '../styls/comm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../plugins/iconfont/iconfont.css';
import '../styls/theme-a.css';
// import fs from 'fs';
new Vue({
    el: '#root',
    router,
    template: '<App/>',
    components: { App }
});
