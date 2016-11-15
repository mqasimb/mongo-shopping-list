exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://localhost/shopping-list' :
                            'mongodb://mongoshoppinglist:abc123@ds153637.mlab.com:53637/mongo-shopping-list');
exports.PORT = process.env.PORT || 8080;