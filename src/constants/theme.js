export const colors = {
  background: '#0F172A',
  surface: '#111827',
  border: '#1F2937',
  
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  
  primary: '#3B82F6',
  success: '#22C55E',
  danger: '#EF4444',
  muted: '#374151',
};

export const typography = {
  pageTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const transitions = [
  { label: 'Fade', value: 'fade' },
  { label: 'Dissolve', value: 'dissolve' },
  { label: 'Slide Left', value: 'slide_left' },
  { label: 'Slide Right', value: 'slide_right' },
  { label: 'Zoom', value: 'zoom' },
];

export const durations = [
  { label: '0.3s', value: 0.3 },
  { label: '0.5s', value: 0.5 },
  { label: '0.8s', value: 0.8 },
  { label: '1.0s', value: 1.0 },
  { label: '1.5s', value: 1.5 },
];

export const aspectRatios = [
  { label: '9:16 (Portrait)', value: '9:16' },
  { label: '16:9 (Landscape)', value: '16:9' },
  { label: '1:1 (Square)', value: '1:1' },
  { label: '4:5 (Instagram)', value: '4:5' },
];
