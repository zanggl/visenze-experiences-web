import type { WidgetClient } from './common/visenze-core';

declare global {
  interface Window {
    visenzeWidgets?: Record<string, WidgetClient>;
    visenzewigmixwidget?: Record<string, Record<string, any>>;
    [key: string]: any;
  }
}
