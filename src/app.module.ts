import { Module } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '@app/ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
