<template>
<div class="editor">
    <div class="left">
        <div class="l-top form-group">
            <input class="form-control" placeholder="Search for sections...">
        </div>
        <div class="catalog">
            <div class="catalog-l1" v-for="volume in group" :key="volume.id">
                <div>
                    <input v-model="volume.nodename"
                    @keyup.enter="saveNodeName(volume, $event)"/>
                    <h3 @dblclick="updateNodeName">
                        {{volume.nodename}}
                    </h3>
                    <i class="icon iconfont icon-empty"></i>
                </div>
                <div class="catalog-l2" v-for="section in volume.children" :key="section.id">
                    <input v-model="section.nodename"
                    @keyup.enter="saveNodeName(section, $event)"/>
                    <h4 @dblclick="updateNodeName"
                        @click="toggleSection(section, volume)"
                        :class="{'active': current.section.id==section.id}">
                        {{section.nodename}}
                    </h4>
                    <i class="icon iconfont icon-editor"
                        @click="delSection(section)"></i>
                </div>
                <div class="catalog-new-section"
                    @click="addSection($event)">
                    <input v-model="newSection"
                        @keyup.enter="insertSection(newSection, $event, volume)">
                        + 添加章节
                </div>
            </div>
            <div class="add-catalog" ref="addVolume">
                <input v-model="newVolume"
                    @keyup.enter="insertNodeName(newVolume, $event, current.book)">
            </div>
        </div>
        <div class="l-bottom">
            <div><i class="icon iconfont icon-label"></i><span>标签</span></div>
            <div>
                <i class="icon iconfont icon-add"></i>
                <span title="为当前书册添加新分卷"
                    @click="addVolume">分卷</span>
            </div>
            <div><i class="icon iconfont icon-computer"></i><span title="查看仓库中书册明细">书册</span></div>
            <div><i class="icon iconfont icon-activity"></i><span>计划</span></div>
        </div>
    </div>
    <div class="center">
        <div class="c-top">
            <div class="percent" :class="saveSuccess ? 'percent100' :''"></div>
            <div class="c-top-left">
                <span>字数：{{total}}</span>
            </div>
            <div class="c-top-right">
                <span>时间：{{currentTime}}</span>
            </div>
        </div>
        <div class="c-main">
            <div class="c-main-nav">
                <span>{{current.book.bookname}} >> 
                {{current.volume.nodename}} >> 
                {{current.section.nodename}}</span>
                <button 
                    class="btn btn-default"
                    @click="saveCnt">保存</button>
            </div>
            <div class="c-main-cnt">
                <div class="c-main-content" ref="editor">
                </div>
            </div>
        </div>
    </div>
    <div class="right"></div>
</div>
</template>

<script>
import Editor from "@plugins/wordpad-editor";
import EditorDao from "@server/dao/editor-dao.js";
export default {
    data () {
        return {
            books: [],
            newVolume: '',
            newSection: '',
            saveSuccess: false,
            currentTime: '',
            total: 0,
            current: {
                book: {
                    bookname: '书册一'
                },
                volume: {
                    nodename: '分卷一'
                },
                section: {
                    nodename: '章节一',
                    content: ''
                }
            },
            group: [],
            editor: null
        }
    },
    computed: {
        
    },
    methods: {
        saveCnt: function() {
            let self = this;
            self.saveSuccess = true;
            let cnt = self.editor.html2Txt();
            EditorDao.updateSectionById(self.current.section.id, cnt).then(res => {
                let saver = setTimeout(() =>{
                    self.saveSuccess= false;
                    saver.clearTimerout();
                }, 1000)
            });
        },
        // 更新节点名称，节点变为可更新状态（input）
        updateNodeName: function(e) {
            let els = e.target.parentNode.children;
            toggleInput(els, true);
        },
        // 将目录改动内容保存到数据库
        saveNodeName: function(node, e) {
            let els = e.target.parentNode.children;
            if(node.id == this.current.volume.id) {
                this.current.volume.nodename = node.nodename;
            }
            if(node.id == this.current.section.id) {
                this.current.section.nodename = node.nodename;
            }
            toggleInput(els, false);
            EditorDao.updateNodeNameById(node.id, node.nodename).then(res => {
                console.log(res);
            });
        },
        toggleSection: function(section, volume) {
            this.current.volume = volume;
            this.current.section = section;
            // 从数据库获取当前章节最新内容
            EditorDao.getSectionById(this.current.section.id).then(res => {
                this.editor.updateHtml(res.content)
                this.current.section = res;
            })
        },
        addVolume: function() {
            let els = this.$refs.addVolume.children;
            toggleInput(els, true);
        },
        insertNodeName: function(node, e, parent) {
            if(!node) return;
            let _self = this;
            // 插入新增分卷到数据库，操作成功以后返回新目录
            EditorDao.insertNodeById(node, 1, 0, _self.current.book.id).then(res => {
                let els = e.target.parentNode.children;
                toggleInput(els, false);
                EditorDao.getCatalogByBookId(_self.current.book.id).then(res => {
                    this.group = res;
                })
            })
        },
        addSection: function(e) {
            let els = e.target.children;
            toggleInput(els, true);
        },
        insertSection: function(node, e, parent) {
            if(!node) return;
            let _self = this;
            // 插入新增分卷到数据库，操作成功以后返回新目录
            EditorDao.insertNodeById(node, 2, parent.id, _self.current.book.id).then(res => {
                let els = e.target.parentNode.children;
                toggleInput(els, false);
                EditorDao.getCatalogByBookId(_self.current.book.id).then(res => {
                    this.group = res;
                })
            })
        }
    },
    created() {
        let _self = this;
        // 初始化current.book
        EditorDao.getBookById(1).then(res => {
            console.log(1);
            _self.current.book = res;
        })
    },
    mounted() {
        let self = this;
        let height = document.body.clientHeight - 148;
        self.$refs.editor.parentNode.setAttribute('style', 'height: '+ height + 'px;');
        // 窗口尺寸发生变化时
        window.onresize = () => {
            let height = document.body.clientHeight - 148;
            self.$refs.editor.parentNode.setAttribute('style', 'height: '+ height + 'px;');
        }
        self.editor = new Editor(self.$refs.editor, {
            lineHeight: 40,
            lineColor: '#E0E2E4'
        });
        // 时间
        let timer = setInterval(() => {
            self.currentTime = new Date().toString();
        });
        
        // 初始化左侧边栏
        EditorDao.getCatalogByBookId(1).then(res => {
            self.group = res;
            // 初始化current.volume
            self.current.volume = res[0];
            // 初始化current.section
            self.current.section = res[0].children[0];
            self.editor.updateHtml(self.current.section.content);
        });
        // 初始化当前章节字数
        self.total = self.current.section.content.length;
        // 为编辑器添加keyup事件
        self.$refs.editor.addEventListener('keyup', function(e) {
            // 更新字数
            self.total =  self.editor.wordCount();
            console.log(e.keyCode);
            // ctrl + s 保存文章更新内容
            if(e.ctrlKey && e.keyCode == 83) {
                let cnt = self.editor.html2Txt();
                self.saveSuccess= true;
                EditorDao.updateSectionById(self.current.section.id, cnt).then(res => {
                    let saver = setTimeout(() =>{
                        self.saveSuccess= false;
                        saver.clearTimerout();
                    }, 1000);
                });
            }
        })
    }
}

// toolkit
function toggleInput(els, isShown) {
    for(let i=0,len=els.length; i<len; i++) {
        if(els.item(i).localName == 'input') {
            if(isShown) {
                els.item(i).setAttribute('class', 'show');
                els.item(i).focus();
            } else {
                els.item(i).classList.remove('show');
            }
        }
    }
}
</script>