import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Get, Post, UseGuards, Param, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.create(
      currentUser,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getDetails(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }
  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, currentUserId);
  }
}
