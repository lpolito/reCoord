import express from 'express';

import {getYoutubeFingerprint} from './fingerprinting/fingerprint-by-url';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'test!'});
});

router.get('/ytdl', async (req, res) => {
    const {url} = req.query;

    try {
        const result = await getYoutubeFingerprint(url);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

export default router;
