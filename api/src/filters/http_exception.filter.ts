// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import { isEmpty } from 'class-validator';
// import { Response } from 'express';
// import { I18nService } from 'nestjs-i18n';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   constructor(private readonly i18n: I18nService) {}

//   async catch(exception: HttpException, host: ArgumentsHost) {
//     const context = host.switchToHttp();
//     const response = context.getResponse<Response>();
//     const statusCode = exception.getStatus();
//     const lang = host.switchToHttp().getRequest().i18nLang;
//     let message = exception.message;
//     if (isEmpty(message)) {
//       switch (statusCode) {
//         case 404: {
//           message = await this.i18n.translate('app.common.404', {
//             lang,
//           });
//           break;
//         }

//         case 401:
//           message = await this.i18n.translate('app.common.401', {
//             lang,
//           });
//           break;

//         case 403:
//           message = await this.i18n.translate('app.common.403', {
//             lang,
//           });
//           break;

//         case 422:
//           message = await this.i18n.translate('app.common.422', {
//             lang,
//           });
//           break;

//         case 500:
//           message = await this.i18n.translate('app.common.500', {
//             lang,
//           });
//           break;
//       }
//     }

//     response.status(statusCode).json({ statusCode, message });
//   }
// }
