import { Router } from 'express';
import { tunisianGovernorates, countries } from '../data/locations';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        tunisianGovernorates,
        countries
    });
});

export default router;
