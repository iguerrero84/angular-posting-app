import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
   selector: 'app-post-list',
   templateUrl: './post-list.component.html',
   styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 3, 5, 10];
  isUserAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: {posts: Post[], postCount: number }) => {
         this.isLoading = false;
         this.totalPosts = postData.postCount;
         this.posts = postData.posts;
      });
      this.isUserAuthenticated = this.authService.getIsAuth();
      this.userId = this.authService.getUserId();

      this.authStatusSub = this.authService.getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.isUserAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
  }

  onChangedPage(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;

    console.log('Ok Page changed '+
       ' currentPage: '+ this.currentPage +
       ' postsPerPage: ' + this.postsPerPage);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
