import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('--------------------------------------------------');
    console.log('📥 Incoming Request');
    console.log('➡ Method:', req.method);
    console.log('➡ URL:', req.originalUrl);
    console.log('➡ IP:', req.ip);
    console.log('➡ Headers:', req.headers);
    console.log('➡ Params:', req.params);
    console.log('➡ Query:', req.query);
    console.log('➡ Body:', req.body);
    console.log('--------------------------------------------------');

    next();
  }
}
