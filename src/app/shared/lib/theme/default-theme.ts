import { ThemeConfig } from 'antd'

export const defaultTheme: ThemeConfig = {
  token: {
    fontFamily: 'var(--font-dm-sans)',
    controlHeight: 36,
    controlHeightLG: 40,
    colorPrimary: '#2a7eff',
    colorText: '#131834',
    colorTextSecondary: '#546b88',
    colorInfo: '#7c98ff',
    colorWarning: '#ff9d6c',
    colorError: '#ef4444',
    colorSuccess: '#16c092',
    colorSuccessBorder: '#10b487',
    colorErrorBorder: '#ef4444',
    colorWarningBorder: '#ff9d6c',
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,
    fontSizeHeading2: 32,
  },
  components: {
    Input: {
      paddingBlock: 8,
    },
    Tag: {
      defaultBg: '#A4AFBD1A',
      defaultColor: '#546b88',
    },
  },
}
