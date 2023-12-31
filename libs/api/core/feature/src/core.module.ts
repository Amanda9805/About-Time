import { AuthModule } from '@mp/api/auth/feature';
import { EventstoreModule } from '@mp/api/eventstore/feature';
import { ProfilesModule } from '@mp/api/profiles/feature';
import { UsersModule } from '@mp/api/users/feature';
import { FeedModule } from '@mp/api/feed/feature';
import { CreatePostModule } from '@mp/api/createpost/feature';
import { SearchModule } from '@mp/api/search/feature';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, EventstoreModule, ProfilesModule, UsersModule, FeedModule, CreatePostModule, SearchModule],
})
export class CoreModule { }
