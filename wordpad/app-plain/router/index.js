import Vue from 'vue';
import Router from 'vue-router';
import Editor from '../views/editor'
Vue.use(Router);

let routes = [{
	path: '/',
	component: Editor
}];

export default new Router({
	routes: routes
});
