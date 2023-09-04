import express from 'express';
import joi from 'joi';
import createError from 'http-errors';
import { getCustomRepository } from 'typeorm';

import { InquestRepository } from '../dao/inquest';
import { inquestQuerySchema } from '../utils/query';
import { validate } from '../utils/validate';

const router = express.Router();

/**
 * Get inquest by ID.
 */

router.get('/:inquestId(\\d+)', async (req, res, next) => {
  const inquestIdValidation = joi.number().integer().positive().required();
  const query = inquestIdValidation.validate((req.params as any)['inquestId']);
  if (query.error) {
    next(createError(400));
    return;
  }

  const inquest = await getCustomRepository(InquestRepository).getInquestFromId(query.value);
  if (!inquest) {
    next(createError(404, 'Inquest not found'));
    return;
  }
  res.json(inquest);
});

/**
 * Get inquests with optional search parameters and pagination.
 */

router.get('/', async (req, res, next) => {
  const query = validate(inquestQuerySchema, req.query);
  if (!query) {
    next(createError(400));
    return;
  }

  const [data, count] = await getCustomRepository(InquestRepository).getInquests(query);
  res.json({ data, count });
});

export default router;
