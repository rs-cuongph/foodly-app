import { HttpService } from '@nestjs/axios';
import {
  Global,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  CheckoutRequestType,
  CheckoutResponseDataType,
} from 'src/types/payos.type';
import * as crypto from 'crypto';

@Global()
@Injectable()
export class PayOSService {
  private logger = new Logger(PayOSService.name);
  private endpoint: string = 'https://api-merchant.payos.vn/v2';
  private headers = {
    'Content-Type': 'application/json',
    'x-client-id': '',
    'x-api-key': '',
  };
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    const xClientId = this.configService.get<string>('payos.clientId');
    const xApiKey = this.configService.get<string>('payos.apiKey');
    this.headers['x-client-id'] = xClientId;
    this.headers['x-api-key'] = xApiKey;
  }

  private createSignature(data: {
    amount: number;
    cancelUrl: string;
    returnUrl: string;
    orderCode: number;
    description: string;
  }) {
    const checksumKey = this.configService.get<string>('payos.checksumKey');
    const amount = data.amount.toString();
    const cancelUrl = data.cancelUrl;
    const description = data.description;
    const orderCode = data.orderCode.toString();
    const returnUrl = data.returnUrl;

    const dataStr = 'amount='
      .concat(amount, '&cancelUrl=')
      .concat(cancelUrl, '&description=')
      .concat(description, '&orderCode=')
      .concat(orderCode, '&returnUrl=')
      .concat(returnUrl);

    // Tạo HMAC SHA256 hash
    const hmac = crypto.createHmac('sha256', checksumKey);
    hmac.update(dataStr);
    const signature = hmac.digest('hex');

    return signature;
  }

  public createPaymentLink(
    body: Omit<CheckoutRequestType, 'signature'>,
  ): Observable<CheckoutResponseDataType> {
    body['signature'] = this.createSignature(body);

    return this.httpService
      .post(`${this.endpoint}/payment-requests`, body, {
        headers: this.headers,
      })
      .pipe(
        map((res) => res.data),
        catchError(() => {
          return throwError(
            () =>
              new HttpException(
                'Failed to create payment link',
                HttpStatus.BAD_REQUEST,
              ),
          );
        }),
      );
  }
}
