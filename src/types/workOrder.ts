export type WorkOrderStatus = 'todo' | 'in_progress' | 'certification' | 'done';
export type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';
export type ActivityType = 'task' | 'inspection' | 'repair' | 'installation';

export interface WorkOrderTask {
  id: string;
  assetCode: string;
  assetId?: string;
  assetStatus: 'operative' | 'maintenance' | 'out_of_service' | 'retired';
  description: string;
  status: 'pending' | 'in_progress' | 'done';
}

export interface StatusTransition {
  id: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus;
  toStatus: WorkOrderStatus;
  comment: string;
  author: string;
  authorRole: string;
  timestamp: string;
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  description: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  activityType: ActivityType;
  assetCategory: string;
  assignedTo: string;
  reporter: string;
  location: string;
  dueDate: string;
  createdAt: string;
  commentsCount: number;
  attachmentsCount: number;
  tasks: WorkOrderTask[];
  transitions: StatusTransition[];
}

export const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  todo: 'Por Hacer',
  in_progress: 'En Progreso',
  certification: 'Certificación',
  done: 'Completada',
};

export const workOrderStatusColors: Record<WorkOrderStatus, string> = {
  todo: 'bg-amber-400',
  in_progress: 'bg-blue-500',
  certification: 'bg-purple-500',
  done: 'bg-green-500',
};

export const workOrderPriorityLabels: Record<WorkOrderPriority, string> = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const workOrderPriorityColors: Record<WorkOrderPriority, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

export const activityTypeLabels: Record<ActivityType, string> = {
  task: 'Tarea',
  inspection: 'Inspección',
  repair: 'Reparación',
  installation: 'Instalación',
};

export const assetCategoryOptions = [
  'Alarmas contra incendios',
  'Detectores de humo',
  'Extintores',
  'Sistemas de riego',
  'Ascensores',
  'Bombas de agua',
];
