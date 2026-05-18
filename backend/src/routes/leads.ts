import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leadsController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

const leadValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long'),
];

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);
router.post('/', leadValidation, validate, createLead);
router.put('/:id', leadValidation, validate, updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
