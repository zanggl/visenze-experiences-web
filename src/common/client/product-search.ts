import type { Root } from 'react-dom/client';
import { v4 as uuid } from 'uuid';
import ViSearch from 'visearch-javascript-sdk';
import type { WidgetInitOptions, WidgetClient } from '../visenze-core';
import { LIB_VERSION } from '../../version';
import type { ErrorHandler, SuccessHandler } from '../types/function';

const Endpoint = 'https://search.visenze.com';

const validateBatchEvents = (
  events: Record<string, string>[],
  failCallback: (err: any) => void = (): void => {},
): boolean => {
  if (!Array.isArray(events)) {
    failCallback(Error('events must be an array'));
    return false;
  }

  if (events.length <= 0) {
    failCallback(Error('events must have at least 1 item'));
    return false;
  }

  return true;
};

const callIfValidFunction = (fn: any, args: any): void => {
  if (fn && typeof fn === 'function') {
    fn(args);
  }
};

const wrapCallbacks = (
  searchCallback: any,
  onSuccess: SuccessHandler,
  onFailure: ErrorHandler,
): ((args: any) => void)[] => {
  const newOnSuccess = (args: any): void => {
    callIfValidFunction(onSuccess, args);
    callIfValidFunction(searchCallback, args);
  };
  const newOnError = (args: any): void => {
    callIfValidFunction(onFailure, args);
    callIfValidFunction(searchCallback, args);
  };
  return [newOnSuccess, newOnError];
};

export default function getWidgetClient(options: WidgetInitOptions): WidgetClient {
  const { config, widgetType, widgetDirectory, deployTypeId } = options;
  const { vttSource, disableAnalytics } = config;
  const lastTrackingMetadata: Record<string, any> = {};
  const { placementId, appKey, strategyId, country, endpoint, gtmTracking, resizeSettings } = config.appSettings;
  const { onSearchCallback } = config?.callbacks;
  let roots: Root[] = [];

  const visearch = ViSearch();
  visearch.setKeys({
    placement_id: placementId,
    strategy_id: strategyId,
    app_key: appKey,
    is_cn: country === 'CN',
    endpoint: endpoint || Endpoint,
    gtm_tracking: gtmTracking,
    resize_settings: resizeSettings || {},
    uid: uuid(),
    sid: uuid(),
  });

  const searchById = (
    pid: string,
    params: Record<string, any>,
    handleSuccess: SuccessHandler,
    handleError: ErrorHandler,
  ): void => {
    const [success, error] = wrapCallbacks(onSearchCallback, handleSuccess, handleError);
    visearch.productSearchById(
      pid,
      {
        ...params,
        return_fields_mapping: true,
        return_query_sys_meta: true,
      },
      success,
      error,
    );
  };

  const multisearchByImage = (
    params: Record<string, any>,
    handleSuccess: SuccessHandler,
    handleError: ErrorHandler,
  ): void => {
    const [success, error] = wrapCallbacks(onSearchCallback, handleSuccess, handleError);
    visearch.productMultisearch(
      {
        ...params,
        return_fields_mapping: true,
        return_query_sys_meta: true,
      },
      success,
      error,
    );
  };

  const multisearchAutocomplete = (
    params: Record<string, any>,
    handleSuccess: SuccessHandler,
    handleError: ErrorHandler,
  ): void => {
    const [success, error] = wrapCallbacks(onSearchCallback, handleSuccess, handleError);
    visearch.productMultisearchAutocomplete(
      {
        ...params,
        return_fields_mapping: true,
        return_query_sys_meta: true,
      },
      success,
      error,
    );
  };

  /**
   * Sends event to ViSenze Analytics
   */
  const send = async (
    action: string,
    params: Record<string, any> = {},
    callback?: (...args: any) => any,
    failure?: (err: any) => void,
  ): Promise<void> => {
    if (disableAnalytics) {
      return;
    }

    const trackingCallback = config?.callbacks.trackingCallback;
    if (trackingCallback && typeof trackingCallback === 'function') {
      trackingCallback(action, params);
    }

    const analyticsParams = params;

    if (!analyticsParams.widgetVersion) {
      analyticsParams.widgetVersion = `${widgetType}.${LIB_VERSION}.js`;
      analyticsParams.widgetDir = widgetDirectory;
    }
    if (vttSource) {
      analyticsParams.vtt_source = vttSource;
    }

    visearch.sendEvent(action, analyticsParams, callback, failure);
  };

  /**
   * Sends batch event to ViSenze Analytics
   */
  const sendEvents = async (
    action: string,
    events: Record<string, string>[],
    callback?: (...args: any) => any,
    failure?: (err: any) => void,
  ): Promise<void> => {
    if (disableAnalytics) {
      return;
    }

    if (!validateBatchEvents(events, failure)) {
      return;
    }

    visearch.generateUuid((batchId) => {
      events.forEach((event) => {
        if (action.toLowerCase() === 'transaction' && !event.transId) {
          event.transId = batchId;
        }
        send(action, event, callback, failure);
      });
    });
  };

  /**
   * Gets query id of the last request, fallback to local storage if there is none
   */
  const getLastQueryId = (): Promise<string> => {
    return new Promise((resolve) => {
      visearch.getLastQueryId((queryId) => resolve(queryId ?? ''));
    });
  };

  const getLastClickQueryId = (): string => {
    let lastClickQueryId = localStorage.getItem(`visenze_last_click_query_id_${placementId}`);
    if (!lastClickQueryId) {
      // defaults to 'none', this indicates that an event happens without visenze influence
      lastClickQueryId = 'none';
    }

    return lastClickQueryId;
  };

  /**
   * Set a value for visearch settings.
   * @param {*} key key for visearch settings
   * @param {*} val value for visearch settings
   */
  const set = (key: string, val: any): void => {
    visearch.set(key, val);
  };

  const hideWidget = (): void => {
    // flush react script
    roots.forEach((root) => {
      root.render(null);
    });
  };

  const disposeWidget = (): void => {
    hideWidget();
    if (placementId && window.visenzeWidgets?.[placementId]) {
      // eslint-disable-next-line
      delete window.visenzeWidgets[placementId];
    }
  };

  const openWidget = (params: object): void => {
    const { cssSelector } = config.displaySettings;
    const element =
      document.querySelector(cssSelector || `.ps-widget-${placementId}`);
    if (element) {
      (element as HTMLElement).dataset.visenzeDialogOpen = 'true';
      if (params) {
        (element as HTMLElement).dataset.visenzeRuntimeParams = JSON.stringify(params);
      }
    }
  };

  const setRenderRoots = (renderRoots: Root[]): void => {
    roots = renderRoots;
  };

  return {
    visearch,
    widgetType,
    deployTypeId,
    placementId: placementId ? Number(placementId) : undefined,
    lastTrackingMetadata,
    set,
    send,
    sendEvent: send,
    sendEvents,
    getLastClickQueryId,
    getLastQueryId,
    searchById,
    multisearchByImage,
    multisearchAutocomplete,
    setRenderRoots,
    rerender: (): void => {},
    openWidget,
    hideWidget,
    disposeWidget,
  };
}
