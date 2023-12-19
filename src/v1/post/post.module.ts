import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/v1/post/schemas/post.schema';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostsModule {}
