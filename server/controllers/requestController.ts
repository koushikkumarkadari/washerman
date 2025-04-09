import { Request, Response } from 'express';
import RequestModel from '../models/Request';

interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export const createRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items } = req.body as { items: string };
    if (!items) {
      res.status(400).json({ message: 'Items are required' });
      return;
    }
    const studentId = req.user?.email.split('@')[0]; // Extract rollno (e.g., 22211a1251)
    const newRequest = new RequestModel({ studentId, items });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAllRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requests = await RequestModel.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body as {
      status?: 'Pending' | 'Processing' | 'Completed';
      paymentStatus?: 'Unpaid' | 'Paid';
    };
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    );
    if (!updatedRequest) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};