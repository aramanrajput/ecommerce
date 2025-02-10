const {connect} = require('mongoose')

const connection = ()=>{
    return connect(`mongodb+srv://${process.env.db_user}:${process.env.db_password}@cluster0.pkzgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0ecommerce`)
}


module.exports = connection