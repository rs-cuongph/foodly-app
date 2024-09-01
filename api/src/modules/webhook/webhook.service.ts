/*
https://docs.nestjs.com/providers#services
*/
import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookService {
  // constructor(private readonly httpService: HttpService) {}
  // public async confirmTransaction(body: WebhookResponseDataType) {
  //   try {
  //     // const find = await this.transactionRepository.findByCondition({
  //     //   paymentLinkId: body.data.paymentLinkId,
  //     // });
  //     // if (find) {
  //     //   console.log('===> find:', find);
  //     //   const metadata = JSON.parse(JSON.stringify(find.metadata));
  //     //   await this.transactionRepository.update(
  //     //     {
  //     //       id: find.id,
  //     //     },
  //     //     {
  //     //       // status: TransactionStatus.COMPLETED,
  //     //     },
  //     //   );
  //     //   if (metadata?.callbackURL) {
  //     //     console.log('====>', metadata?.callbackURL);
  //     //     await this.httpService
  //     //       .post(metadata.callbackURL, metadata)
  //     //       .toPromise();
  //     //   }
  //     //   return true;
  //     // } else {
  //     //   return false;
  //     // }
  //   } catch (e) {
  //     throw new BadRequestException(e);
  //   }
  // }
}
