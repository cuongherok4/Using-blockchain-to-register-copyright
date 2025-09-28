// src/common/pipes/validation-with-logging.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationWithLoggingPipe implements PipeTransform<any> {
  private readonly logger = new Logger('DTOValidation');

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      // Log chi tiết lỗi validation
      this.logger.error(`DTO Validation Failed: ${metatype.name}`, {
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
          value: err.value
        })),
        inputValue: value
      });

      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors.map(err => ({
          field: err.property,
          errors: Object.values(err.constraints || {})
        }))
      });
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}