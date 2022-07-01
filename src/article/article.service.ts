import slugify from 'slugify';
import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  private generateSlug(title: string): string {
    const randomPart = ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    return `${slugify(title, { lower: true })}-${randomPart}`;
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return {
      article,
    };
  }

  async create(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.generateSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }
}
