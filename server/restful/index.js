import express from 'express';
import exportExceptionsHandler from './export-exceptions';
import searchUSCitiesHandler from './search-us-cities';
import getDistanceHandler from './get-distance';
import runTaqHandler from './run-taq';
import importQuoteHandler from './import-quote';
import getCarrierDataHandler from './get-carrier-data';
import getCentralDispatchIdHandler from './central-dispatch-id';

const router = express.Router();

router.get('/helloworld', (req, res) => {
  res.json({
    success: true,
    msg: 'hey'
  });
});

router.get('/export-exceptions', exportExceptionsHandler);
router.get('/cities', searchUSCitiesHandler);
router.get('/distance', getDistanceHandler);
router.post('/run-taq', runTaqHandler);
router.post('/leads/:source', importQuoteHandler);
router.get('/carrier-data', getCarrierDataHandler);
router.get('/central-dispatch-id', getCentralDispatchIdHandler);

export default router;
