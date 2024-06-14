import type { CroppedBox, Coordinates } from './types/box';

export const isSameBox = (box1: CroppedBox, box2: CroppedBox | undefined): boolean => {
  if (!box2) {
    return false;
  }
  return box1.x1 === box2.x1 && box1.y1 === box2.y1 && box1.x2 === box2.x2 && box1.y2 === box2.y2;
};

export const getClientCoordinates = (evt: any): Coordinates => {
  return evt.touches
    ? {
        clientX: evt.touches[0].clientX,
        clientY: evt.touches[0].clientY,
      }
    : {
        clientX: evt.clientX,
        clientY: evt.clientY,
      };
};

// Simple abstraction for dragging events names.
export const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend',
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup',
  },
  window: {
    resize: 'resize',
  },
};

// Get from offsetParent
export const offsetXYFromParentOf = (
  evt: TouchEvent | MouseEvent,
  offsetParent: HTMLElement | null,
): { x: number; y: number } | null => {
  if (!offsetParent) {
    return null;
  }
  let eventCoord;
  if ('touches' in evt) {
    eventCoord = {
      clientX: evt.touches[0].clientX,
      clientY: evt.touches[0].clientY,
    };
  } else {
    eventCoord = {
      clientX: evt.clientX,
      clientY: evt.clientY,
    };
  }

  offsetParent = document.body;
  const offsetParentRect =
    offsetParent === document.body
      ? {
          left: 0,
          top: 0,
        }
      : offsetParent.getBoundingClientRect();
  const x = eventCoord.clientX + offsetParent.scrollLeft - offsetParentRect.left;
  const y = eventCoord.clientY + offsetParent.scrollTop - offsetParentRect.top;
  return {
    x,
    y,
  };
};

export const addEvent = (el: any, event: string, handler: any): void => {
  if (!el) {
    return;
  }
  if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, true);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = handler;
  }
};

export const removeEvent = (el: any, event: string, handler: any): void => {
  if (!el) {
    return;
  }
  if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, true);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = null;
  }
};
