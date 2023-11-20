import { Request, Response } from 'express';

export const getIndexPage = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: 'Index Page is Working',
  });
};