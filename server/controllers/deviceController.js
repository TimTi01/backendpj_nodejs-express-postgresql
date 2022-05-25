const uuid = require('uuid') // библиотека id генератор
const path = require('path')
const { Device } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
    
            const device = await Device.create({name, price, brandId, typeId, img: fileName})
    
            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const {brandId, typeId} = req.query
        let devices;
        // фильтрация, если нет ни бренда ни типа
        if (!brandId && !typeId) {
            devices = await Device.findAll()   
        }
        
        // фильтрация, если есть бренд, но нет типа
        if (brandId && !typeId) {
            devices = await Device.findAll({where: {brandId}})   
        }
        
        // фильтрация, если есть тип, но нет бренда
        if (!brandId && typeId) {
            devices = await Device.findAll({where: {typeId}})   
        }

        // фильтрация, если есть тип и бренд
        if (brandId && typeId) {
            devices = await Device.findAll({where: {typeId, brandId}})
        }

        return res.json(devices)
    }

    async getOne(req, res) {

    }
}

module.exports = new DeviceController()