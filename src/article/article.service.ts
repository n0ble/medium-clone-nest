import slugify from 'slugify';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/createArticle.dto';
import { IArticleResponse } from './types/articleResponse.interface';
import { UpdateArticleDto } from './dto/updateArticleDto';

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

  async updateArticle(
    updateArticleDto: UpdateArticleDto,
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException("Article doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not the author!', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);
    article.slug = this.generateSlug(updateArticleDto.title);
    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return this.articleRepository.findOne({ slug });
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException("Article doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not the author!', HttpStatus.FORBIDDEN);
    }
    return await this.articleRepository.delete({ slug });
  }
}
