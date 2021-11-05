import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationRequest<T> {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  take: number;

  @ApiPropertyOptional({ name: 'orderBy', type: 'string' })
  @IsOptional()
  orderBy?: keyof T;

  @ApiPropertyOptional({ enum: SORT_DIRECTION })
  @IsOptional()
  orderDirection?: SORT_DIRECTION;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  isGettingDeleted?: boolean;
}

export class PaginationResult<T> {
  constructor(data: T[], count: number) {
    this.data = data;
    this.count = count;
  }

  data: T[];
  count: number;
}
