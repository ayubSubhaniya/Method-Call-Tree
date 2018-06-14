const Service = require('../models/service');

module.exports = {
    getAllServices: async (req, res, next) => {
        const services = await Service.find({});
        res.status(200).json(services);
    },

    addService: async (req, res, next) => {
        const newService = new Service(req.body);
        const service = await newService.save();
        res.status(201).json(service);
    },

    getService: async (req, res, next) => {
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);
        res.status(200).json(service);
    },

    replaceService: async (req, res, next) => {
        const { serviceId } = req.params;
        const newService = req.body;
        const result = await Service.findByIdAndUpdate(serviceId, newService);
        res.status(200).json({ sucess: true });
    },

    updateService: async (req, res, next) => {
        const { serviceId } = req.params;
        const newService = req.body;
        const result = await Service.findByIdAndUpdate(serviceId, newService);
        res.status(200).json({ sucess: true });
    },
};
