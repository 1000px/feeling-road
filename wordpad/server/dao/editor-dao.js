const toolkit = require('@refs/db-toolkit.js').default;

/**
 * 根据书册id获取目录
 * @function getCatalogByBookId
 * @param id 书册id
 */
let getCatalogByBookId = async (id) => {
    // 判断当前书册有几级目录
    let levelOpt = {
        sql: 'select distinct level from book_node where bookid = ?',
        args: [id]
    }
    let levels = await toolkit.execQuery(levelOpt);
    let resTmp = [], res0 = [], len = levels.length;
    for(let i=1; i<=len; i++) {
        let opt = {
            sql: 'select * from book_node where bookid = ? and level = ' + i,
            args: [id]
        }
        let _res = await toolkit.execQuery(opt);
        _res.forEach(item => {
            if(item.parentid === 0) {
                res0.push(item);
            } else {
                resTmp.push(item);
            }
        });
    }
    let restLen = resTmp.length, n = 2;
    // 目前仅实现level<=2层级逻辑关系
    while(restLen > 0) {
        resTmp.forEach((item, index) => {
            switch(n) {
                case 2:
                    res0.forEach(element => {
                        if(element.id === item.parentid) {
                            element.children = element.children ? element.children : [];
                            element.children.push(item);
                            resTmp.splice(index, 1);
                        }
                    });
                    break;
                case 3:
                    res0.forEach(element => {
                        element.children.forEach(innerItem => {
                            if(innerItem.id === item.parentid) {
                                innerItem.children = innerItem.children ? innerItem.children : [];
                                innerItem.children.push(item);
                                resTmp.splice(index, 1);
                            }
                        })
                    });
                break;
            }
        });
        restLen = resTmp.length;
    }
    return res0;
}
/**
 * 根据书册id获取书册信息
 * @function getBookById
 * @param id 书册id
 */
let getBookById = async (id) => {
    let opt = {
        sql: 'select * from books where id = ?',
        args: [id]
    }
    let books = await toolkit.execQuery(opt);
    return books[0];
}
/**
 * 根据id获取章节信息（章节内容等）
 * @function getSectionById
 * @param id 书册id
 */
let getSectionById = async (id) => {
    let opt = {
        sql: 'select * from book_node where id = ?',
        args: [id]
    }
    let sections = await toolkit.execQuery(opt);
    return sections[0];
}
/**
 * 根据书册id获取书册信息
 * @function updateSectionById
 * @param id 书册id
 */
let updateSectionById = async (id, content) => {
    let opt = {
        sql: 'update book_node set content = ? where id = ?',
        args: [content, id]
    }
    let res = await toolkit.execQuery(opt);
    return res;
}
/**
 * 根据id更新节点名称
 * @function updateNodeNameById
 * @param id 书册id
 */
let updateNodeNameById = async (id, name) => {
    let opt = {
        sql: 'update book_node set nodename = ? where id = ?',
        args: [name, id]
    }
    let res = await toolkit.execQuery(opt);
    return res;
}
/**
 * 插入新分卷
 * @function insertNodeById
 * @param nodename
 * @param level
 * @param parentid
 * @param bookid
 */
let insertNodeById = async (nodename, level, parentid, bookid) => {
    let opt = {
        sql: 'insert into book_node(nodename, level, parentid, bookid) ' + 
            'values(?, ?, ?, ?)',
        args: [nodename, level, parentid, bookid]
    }
    let res = await toolkit.execQuery(opt);
    return res;
}

export default {
    getCatalogByBookId: getCatalogByBookId,
    getBookById: getBookById,
    getSectionById: getSectionById,
    updateSectionById: updateSectionById,
    updateNodeNameById: updateNodeNameById,
    insertNodeById: insertNodeById
}