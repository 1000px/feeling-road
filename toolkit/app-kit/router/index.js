import Vue from 'vue';
import Router from 'vue-router';
import Batch from '../views/batch'
Vue.use(Router);

let routes = [{
	path: '/',
	component: Batch
}];

export default new Router({
	routes: routes
});
