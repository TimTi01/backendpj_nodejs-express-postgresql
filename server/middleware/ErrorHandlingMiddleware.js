const ApiError = require('../error/ApiError')

module.exports = function(err, req, res, next) {
    //Если класс ошибки ApiError, то возвращаем статус, 
    // если класс ошибки не ApiError, то возращаем код 500  
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "Непредвиденная ошибка!"})
}