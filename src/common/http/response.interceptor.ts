import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../http/ApiResponse';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
       
        return { originalData: data };
      }),
      catchError(error => {
        console.error('Error in ResponseInterceptor:', error);
        throw error;
      }),
    );
  }
}
