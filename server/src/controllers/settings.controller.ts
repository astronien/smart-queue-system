import { Request, Response } from 'express';
import { prisma } from '../index';

// Get settings
export async function getSettings(req: Request, res: Response) {
  try {
    const { branchId } = req.params;

    let settings = await prisma.registrationSettings.findUnique({
      where: { branchId }
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.registrationSettings.create({
        data: {
          branchId,
          title: 'Smart Queue',
          subtitle: 'กรอกข้อมูลเพื่อรับบัตรคิว',
          themeColor: '#0ea5e9',
          customFields: []
        }
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
}

// Update settings
export async function updateSettings(req: Request, res: Response) {
  try {
    const { branchId } = req.params;
    const data = req.body;

    const settings = await prisma.registrationSettings.upsert({
      where: { branchId },
      update: data,
      create: {
        branchId,
        ...data
      }
    });

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
}
