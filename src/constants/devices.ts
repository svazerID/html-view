import { DeviceConfig } from '../types';

export const DEVICE_PRESETS: DeviceConfig[] = [
  {
    id: 'responsive',
    label: 'Responsive',
    width: null,
    height: null,
    icon: 'Maximize2',
  },
  {
    id: 'mobile',
    label: 'Mobile (375px)',
    width: 375,
    height: 667,
    icon: 'Smartphone',
  },
  {
    id: 'mobile-lg',
    label: 'Mobile L (430px)',
    width: 430,
    height: 932,
    icon: 'Smartphone',
  },
  {
    id: 'tablet',
    label: 'Tablet (768px)',
    width: 768,
    height: 1024,
    icon: 'Tablet',
  },
  {
    id: 'laptop',
    label: 'Laptop (1024px)',
    width: 1024,
    height: 720,
    icon: 'Laptop',
  },
  {
    id: 'desktop',
    label: 'Desktop (1280px)',
    width: 1280,
    height: 800,
    icon: 'Monitor',
  },
];
