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

  private createSignature(data: object) {
    // Sắp xếp dữ liệu theo thứ tự bảng chữ cái của key
    const checksumKey = this.configService.get<string>('payos.checksumKey');
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
    // Chuyển đổi dữ liệu đã sắp xếp thành chuỗi query string
    const queryString = new URLSearchParams(sortedData).toString();

    // Tạo HMAC SHA256 hash
    const hmac = crypto.createHmac('sha256', checksumKey);
    hmac.update(queryString);
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
