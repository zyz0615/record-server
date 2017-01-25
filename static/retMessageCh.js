let retMessage = {
    SUCCESS: function(action) {
        action = action || '操作'
        return {
            retCode: '1001',
            retMessage: action + '成功!'
        }
    },
    ERROR_NO_DATA: {
        retCode: '9001',
        retMessage: '操作失败(无相关数据)'
    },
    ERROR_UNKNOWN_USER: {
        retCode: '9002',
        retMessage: '操作失败(需要登陆)'
    },
    ERROR_INVALID_USER: {
        retCode: '9003',
        retMessage: '操作失败(无效用户)'
    },
    ERROR_NONEXIST_USER: {
        retCode: '9004',
        retMessage: '操作失败(用户无效)'
    },
    ERROR_INVALID_INPUT: {
        retCode: '9999',
        retMessage: '操作失败(参数异常)'
    },
    ERROR_DB: {
        retCode: '8001',
        retMessage: '操作失败(数据库异常)'
    },
    ERROR_DATA_CONFLICT: {
        retCode: '8002',
        retMessage: '操作失败(重复添加)'
    }
}

module.exports = retMessage