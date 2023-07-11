const { Router } = require('express');
const roommateRoutes = require('./roommateRoutes');
const gastoRoutes = require('./gastoRoutes');

const router = Router();
router.use('/roommate', roommateRoutes);
router.use('/gasto', gastoRoutes);

module.exports = router;
