<template>
<div class="batch">
    <div class="batch-left"> 
        左侧
    </div>
    <div class="batch-main">主体内容区域</div>
    <div class="batch-right">右侧边栏</div>
</div>
</template>

<script>
export default {
    name: 'batch',
    data() {
        return {
            
        }
    },
    methods: {
        
    }
}
</script>

<style>
.batch {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: stretch;
}
.batch > div:nth-child(1) {
    width: 200px;
}
.batch > div:nth-child(2) {
    border-left: 1px solid #999;
    flex: 1;
}
.batch > div:nth-child(3) {
    border-left: 1px solid #999;
    width: 200px;
}
</style>