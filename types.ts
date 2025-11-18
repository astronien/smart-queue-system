
export enum Station {
  TRADE_IN = 'TRADE_IN',
  PAYMENT = 'PAYMENT',
  DEVICE_CHECK = 'DEVICE_CHECK',
  DATA_TRANSFER = 'DATA_TRANSFER',
}

export enum CustomFieldType {
  TEXT = 'TEXT',
  CHECKBOX = 'CHECKBOX',
}

export interface CustomField {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
}

export type CustomFieldDataValue = string | boolean;
export type CustomFieldData = { [key: string]: CustomFieldDataValue };

export interface Customer {
  id: number;
  queueNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  station: Station;
  createdAt: Date;
  customFieldData: CustomFieldData;
  status: 'WAITING' | 'IN_PROGRESS';
}

export interface RegistrationSettings {
  logoUrl: string;
  title: string;
  subtitle: string;
  themeColor: string;
  customFields: CustomField[];
}