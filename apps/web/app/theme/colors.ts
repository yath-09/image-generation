/**
 * Centralized color theme configuration
 * Following industry standards for design systems
 */

export const colors = {
    // Primary brand colors
    primary: {
        50: '#fef7ed',
        100: '#fdedd3',
        200: '#fbd7a5',
        300: '#f8ba6d',
        400: '#f59432',
        500: '#FBA87C', // Main brand color
        600: '#e67e22',
        700: '#d35400',
        800: '#b8470a',
        900: '#9c3d0e',
    },

    // Secondary brand colors
    secondary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main secondary color
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },

    // Neutral colors for dark theme
    neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },

    // Dark theme specific colors
    dark: {
        background: '#0f172a', // neutral-900
        surface: '#1e293b', // neutral-800
        surfaceElevated: '#334155', // neutral-700
        border: '#475569', // neutral-600
        text: {
            primary: '#f8fafc', // neutral-50
            secondary: '#cbd5e1', // neutral-300
            muted: '#94a3b8', // neutral-400
        },
    },

    // Light theme specific colors (for reference)
    light: {
        background: '#ffffff',
        surface: '#f8fafc',
        surfaceElevated: '#f1f5f9',
        border: '#e2e8f0',
        text: {
            primary: '#0f172a', // neutral-900
            secondary: '#475569', // neutral-600
            muted: '#64748b', // neutral-500
        },
    },

    // Status colors
    success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
    },
    warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
    },
    error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
    },

    // Gradient definitions
    gradients: {
        primary: 'from-blue-400 to-[#FBA87C]',
        secondary: 'from-purple-500 to-pink-500',
        accent: 'from-pink-500 to-red-500',
        warm: 'from-red-500 to-orange-500',
        cool: 'from-blue-500 to-cyan-500',
    },
} as const;

// Theme configuration object
export const theme = {
    colors,

    // Dark theme configuration
    dark: {
        background: colors.dark.background,
        surface: colors.dark.surface,
        surfaceElevated: colors.dark.surfaceElevated,
        border: colors.dark.border,
        text: colors.dark.text,
        primary: colors.primary[500],
        secondary: colors.secondary[500],
    },

    // Light theme configuration
    light: {
        background: colors.light.background,
        surface: colors.light.surface,
        surfaceElevated: colors.light.surfaceElevated,
        border: colors.light.border,
        text: colors.light.text,
        primary: colors.primary[500],
        secondary: colors.secondary[500],
    },
} as const;

// Export commonly used color combinations
export const darkThemeClasses = {
    background: 'bg-[#0f172a]',
    surface: 'bg-[#1e293b]',
    surfaceElevated: 'bg-[#334155]',
    border: 'border-[#475569]',
    textPrimary: 'text-[#f8fafc]',
    textSecondary: 'text-[#cbd5e1]',
    textMuted: 'text-[#94a3b8]',
} as const;

export const lightThemeClasses = {
    background: 'bg-white',
    surface: 'bg-[#f8fafc]',
    surfaceElevated: 'bg-[#f1f5f9]',
    border: 'border-[#e2e8f0]',
    textPrimary: 'text-[#0f172a]',
    textSecondary: 'text-[#475569]',
    textMuted: 'text-[#64748b]',
} as const;

// Type definitions for better TypeScript support
export type ColorTheme = typeof theme.dark;
export type ColorPalette = typeof colors;
