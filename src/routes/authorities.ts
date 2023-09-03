import express from 'express';
import joi from 'joi';
import createError from 'http-errors';
import { getCustomRepository } from 'typeorm';

import { AuthorityRepository } from '../dao/authority';
import { authorityQuerySchema } from '../utils/query';
import { validate } from '../utils/validate';

const router = express.Router();

/**
 * Get authority by ID.
 */

router.get('/:authorityId(\\d+)', async (req, res, next) => {
  const authorityIdSchema = joi.number().integer().positive().required();
  const query = authorityIdSchema.validate((req.params as any)['authorityId']);
  if (query.error) {
    next(createError(400));
    return;
  }

  const authority = await getCustomRepository(AuthorityRepository).getAuthorityFromId(query.value);
  if (!authority) {
    next(createError(404, 'Authority not found'));
    return;
  }
  res.json(authority);
});

/**
 * Get authorities with optional search parameters and pagination.
 */

router.get('/', async (req, res, next) => {
  const query = validate(authorityQuerySchema, req.query);
  if (!query) {
    next(createError(400));
    return;
  }

  const [data, count] = await getCustomRepository(AuthorityRepository).getAuthorities(query);
  res.json({ data, count });
});

export default router;
