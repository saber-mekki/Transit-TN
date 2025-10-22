import { Router } from 'express';
import { tunisianGovernorates, countries } from '../data/locations';

export const router = Router();

router.get('/', (req, res) => {
    res.json({
        tunisianGovernorates,
        countries
    });
});
