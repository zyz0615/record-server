let retMessage = {
    SUCCESS: function(action) {
        action = action || 'Action'
        return {
            retCode: '1001',
            retMessage: action + ' success!'
        }
    },
    ERROR_NO_DATA: {
        retCode: '9001',
        retMessage: 'Action Failed(No data found)'
    },
    ERROR_UNKNOWN_USER: {
        retCode: '9002',
        retMessage: 'Action Failed(Need to login first)'
    },
    ERROR_INVALID_USER: {
        retCode: '9003',
        retMessage: 'Action Failed(User not authorized)'
    },
    ERROR_NONEXIST_USER: {
        retCode: '9004',
        retMessage: 'Action Failed(User does not exist)'
    },
    ERROR_INVALID_INPUT: {
        retCode: '9999',
        retMessage: 'Action Failed(Invalid input)'
    },
    ERROR_DB: {
        retCode: '8001',
        retMessage: 'Action Failed(DB Error)'
    },
    ERROR_DATA_CONFLICT: {
        retCode: '8002',
        retMessage: 'Action Failed(Data already exist)'
    }
}

module.exports = retMessage