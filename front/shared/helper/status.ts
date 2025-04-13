import { ORDER_STATUS_ENUM } from '@/config/constant';

export class StatusHelper {
  private static _t: any;

  constructor(t: any) {
    // For backward compatibility
    StatusHelper._t = t;
  }

  static setTranslation(t: any): void {
    StatusHelper._t = t;
  }

  static getStatusText(statusKey: string): string {
    const statusMap: Record<string, string> = {
      [ORDER_STATUS_ENUM.INIT]: StatusHelper?._t?.('common.status.order.init'),
      [ORDER_STATUS_ENUM.PROCESSING]: StatusHelper?._t?.(
        'common.status.order.processing',
      ),
      [ORDER_STATUS_ENUM.COMPLETED]: StatusHelper?._t?.(
        'common.status.order.completed',
      ),
      [ORDER_STATUS_ENUM.CANCELED]: StatusHelper?._t?.(
        'common.status.order.cancelled',
      ),
    };

    return statusMap[statusKey] || statusKey;
  }

  static getStatusOptions(): { name: string; uid: string }[] {
    return [
      {
        name: this.getStatusText(ORDER_STATUS_ENUM.INIT),
        uid: ORDER_STATUS_ENUM.INIT,
      },
      {
        name: this.getStatusText(ORDER_STATUS_ENUM.PROCESSING),
        uid: ORDER_STATUS_ENUM.PROCESSING,
      },
      {
        name: this.getStatusText(ORDER_STATUS_ENUM.COMPLETED),
        uid: ORDER_STATUS_ENUM.COMPLETED,
      },
      {
        name: this.getStatusText(ORDER_STATUS_ENUM.CANCELED),
        uid: ORDER_STATUS_ENUM.CANCELED,
      },
    ];
  }
}

export default StatusHelper;
