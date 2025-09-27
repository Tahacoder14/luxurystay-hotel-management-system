const DashboardService = require('../services/dashboardService');

exports.getDashboardData = async (req, res, next) => {
    try {
        const data = await DashboardService.getStats();
        res.json(data);
    } catch (error) {
        next(error);
    }
};