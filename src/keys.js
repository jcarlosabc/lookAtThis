const puerto = 3000;
module.exports = {
    database: {
        host:'localhost',
        user:'root',
        password:'',
        database:'redsocial'
    },
    port: puerto,
    config : {
        my_domain: 'http://localhost:' + puerto,
    }
}