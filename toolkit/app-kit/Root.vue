<template>
	<div class="frame">
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'root',
	data() {
		return {}
	}
};
</script>

<style lang="scss" type="text/scss">
.frame {
	font-family: 'PingFang SC', 'Hiragino Sans GB', 'Micorosoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial';
	width: 100%;
	height: 100%;
}
</style>
