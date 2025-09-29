import DashboardService from '../services/dashboardService.js';

export const getDashboardData = async (req, res, next) => {
    try {
        const data = await DashboardService.getStats();
        res.json(data);
    } catch (error) {
        next(error);
    }
};