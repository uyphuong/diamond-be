import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { Types } from 'mongoose';
import { GetQuery } from 'src/utils/get-query.interfaces';
import { RequestExpress } from 'src/core/auth/interfaces/exception-response.interface';
import { AuthGuard } from 'src/core/auth/guards/auth.guard';
import { WithActiveTokenOnly } from 'src/core/auth/decorators/token-meta.decoratios';
import { UpsertRatingDTO } from './dto/upsert-rating.dto';

@UseGuards(AuthGuard)
@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @WithActiveTokenOnly()
  @Post('/')
  async createRating(
    @Body() upsertRatingDTO: UpsertRatingDTO,
    @Request() req: RequestExpress,
  ) {
    const user = req.user;
    if (!user) throw new Error('User Not Found');
    return await this.ratingService.createRating(upsertRatingDTO, user);
  }

  @Get('/')
  async getRatings(@Query() query: GetQuery) {
    return await this.ratingService.getRatings(query);
  }

  @Get('/:id')
  async getRating(@Param('id') id: Types.ObjectId) {
    return await this.ratingService.getRating(id);
  }

  @Put('/:id')
  async updateSubCategory(
    @Body() upsertRatingDTO: UpsertRatingDTO,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.ratingService.updateRating(upsertRatingDTO, id);
  }

  @Delete('/:id')
  async deleteRating(@Param() { id }: { id: Types.ObjectId }) {
    return await this.ratingService.deleteRating(id);
  }
}
