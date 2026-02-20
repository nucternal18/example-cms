import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PageStatus, type User } from '@prisma/client';

@Controller('api/pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  create(@Body() createPageDto: CreatePageDto, @CurrentUser() user: User) {
    // TODO: Get user ID from database using clerkId
    return this.pagesService.create(createPageDto, user.id);
  }

  @Get()
  findAllPublished() {
    // Public endpoint - only returns published pages
    return this.pagesService.getPublishedPages();
  }

  @Get('admin')
  @UseGuards(ClerkAuthGuard)
  findAllAdmin(
    @Query('status') status?: PageStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.pagesService.findAll(status, page, limit);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    // Public endpoint for accessing pages by slug
    return this.pagesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(ClerkAuthGuard)
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  remove(@Param('id') id: string) {
    return this.pagesService.remove(id);
  }
}
