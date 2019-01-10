/**
 * @module 文字编辑
 * @api init html2Txt newSection cursorTo 
 */
/**
 * 全局设置
 */

/**
 * @name Editor
 * @param el 容器元素，编辑器外部容器
 * @param config 编辑器初始化信息，设置行高、背景色、线条颜色等
 */
class Editor {
    constructor(el, config) {
        // 生成随机Number
        let t = new Date().valueOf() + Math.round(Math.random()*100);
        let _self = this;
        let lineTotal = 0;
        _self.frame = el;
        _self.config = {
            lineHeight: !isNaN(config.lineHeight) ? config.lineHeight : 40, // 纸张行高
            bgColor: config.bgColor ? config.bgColor : '#FFFFFF', // 纸张背景色
            lineColor: config.lineColor ? config.lineColor : '#999999' // 网线颜色
        };
        // 为容器设置标记data-tag
        _self.frame.setAttribute('data-tag', t);
        // 记录data-tag标记
        _self.frameTag = t;
        
        // 获取容器信息
        _self.rectInfo = _self.frame.getBoundingClientRect();
        // 计算当前容器多少行
        _self.lineTotal = Math.floor(_self.rectInfo.height / 40);
        // 给容器添加点击事件
        _self.frame.addEventListener('click', function(e) {
            cursorLogic(e, _self);
        });
        _self.frame.addEventListener('keydown', function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13) {
                e.preventDefault();
            }
        });
        _self.frame.addEventListener('keyup', function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==13) {
                // 如果当前p标签为空，则不允许换行
                let cnt = e.target.innerText.replace(/\s*/g,"");
                if(!cnt) return;
                // 添加p标签
                let p = createPElement(_self, '', true);
                insertAfter(p, e.target);
                p.focus();
            }
        });
    }
    html2Txt() {
        let self = this;
        let txt = '';
        let ps = self.frame.children;
        for(let i=0, len=ps.length; i<len; i++) {
            let cnt = ps.item(i).innerText.replace(/\s*/g,"");
            if(cnt) {
                txt += cnt + '\\r\\n';
            }
        }
        return txt;
    }
    wordCount() {
        
        let self = this;
        let txt = '';
        let ps = self.frame.children;
        console.log('word count...', ps);
        for(let i=0, len=ps.length; i<len; i++) {
            let cnt = ps.item(i).innerText.replace(/\s*/g,"");
            if(cnt) {
                txt += cnt;
            }
        }
        return txt.length;
    }
    newSection() {
        console.log('new section ...');
    }
    updateHtml(text) {
        let self = this;
        self.frame.innerHTML = null;
        if(!text) return;
        // 分析text，按照/r/n将text分成不同的段落，存在ps中
        let ps = text.split('\\r\\n');
        ps.forEach(p => {
            let pCnt = p.replace(/\s*/g,"");
            if(pCnt) {
                let pEl = createPElement(self, pCnt, true);
                self.frame.appendChild(pEl);
            }
        });
    }
}

function createPElement(self, content, flag) {
    let pEl = document.createElement('p');
    pEl.innerText = content;
    pEl.contentEditable = true;
    // 在容器内画网线，加入背景色
    pEl.style.cssText += 'background: -webkit-linear-gradient(top, ' 
    + self.config.bgColor + ' ' + (self.config.lineHeight - 1) + 'px,'
    + self.config.lineColor + ' ' + self.config.lineHeight + 'px);';
    pEl.style.cssText += 'background-size: 100% ' + self.config.lineHeight + 'px;';
    pEl.style.cssText += 'position: relative;';
    pEl.style.cssText += 'min-height: ' + self.config.lineHeight 
    + 'px; line-height: ' + self.config.lineHeight + 'px;';
    pEl.style.cssText += 'padding: 0 12px; margin: 0;';
    (flag) && (pEl.style.cssText += 'text-indent: 24px;');
    return pEl;
}

/**
 * 鼠标点击事件逻辑
 * 1、定位光标
 * 2、容器中仅允许出现p标签，段落和换行都使用p标签
 * 3、p标签设置为可编辑状态
 */
function cursorLogic(e, self) {
    // 获取鼠标点击目标元素
    let dataTag = e.target && e.target.getAttribute('data-tag');
    // 目标元素不是当前容器，即目标元素是p标签
    if(!dataTag || parseInt(dataTag) !== self.frameTag) {
        // ...
    } else {
        // 判断鼠标点击在第几行
        let x = e.offsetX, y = e.offsetY;
        let lineIndex = Math.floor(y/40) + 1; // 当前鼠标点击第几行
        let pEl = createPElement(self, '', true);
        self.frame.appendChild(pEl);
        // 将光标定位到新生成的p标签内
        pEl.focus();
    }  
}
/**
 * insertAfter(newElement, targetElement)
 * 在当前元素后面插入新的
 */
function insertAfter(newElement, targetElement) {
    let parent = targetElement.parentNode;
    if(parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
export default Editor;