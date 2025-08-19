import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
