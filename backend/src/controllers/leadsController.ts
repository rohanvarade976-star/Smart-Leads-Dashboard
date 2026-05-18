import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { sendSuccess, sendError } from '../utils/response';
import { generateCSV } from '../utils/csv';
import { LeadQueryParams, LeadStatus, LeadSource } from '../types';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../models/Lead';

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadQueryParams;

    const filter: FilterQuery<ILeadDocument> = {};

    if (status) filter.status = status as LeadStatus;
    if (source) filter.source = source as LeadSource;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    sendSuccess(res, 'Leads fetched successfully', leads, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    });
  } catch {
    sendError(res, 'Failed to fetch leads', 500);
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }
    sendSuccess(res, 'Lead fetched', lead);
  } catch {
    sendError(res, 'Failed to fetch lead', 500);
  }
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.userId });
    sendSuccess(res, 'Lead created successfully', lead, 201);
  } catch (error) {
    sendError(res, 'Failed to create lead', 500);
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }
    sendSuccess(res, 'Lead updated successfully', lead);
  } catch {
    sendError(res, 'Failed to update lead', 500);
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin) {
      sendError(res, 'Only admins can delete leads', 403);
      return;
    }
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      sendError(res, 'Lead not found', 404);
      return;
    }
    sendSuccess(res, 'Lead deleted successfully');
  } catch {
    sendError(res, 'Failed to delete lead', 500);
  }
};

export const exportLeadsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search } = req.query as Partial<LeadQueryParams>;
    const filter: FilterQuery<ILeadDocument> = {};

    if (status) filter.status = status as LeadStatus;
    if (source) filter.source = source as LeadSource;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    const csv = generateCSV(leads);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csv);
  } catch {
    sendError(res, 'Failed to export leads', 500);
  }
};
