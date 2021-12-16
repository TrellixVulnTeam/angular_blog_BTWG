import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { BlogService } from 'src/app/shared/blog.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditblogsComponent } from '../editblogs/editblogs.component';
import { Blog } from 'src/app/shared/Model/blog.model';

@Component({
  selector: 'app-myblog',
  templateUrl: './myblog.component.html',
  styleUrls: ['./myblog.component.css'],
})
export class MyblogComponent implements OnInit,OnChanges {
  authorName: String;
  myFinalBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.authorName = this.authService.loginUserNameOrEmail;
    this.getMyBlog();
  }

  ngOnInit(): void {
    this.getUpdatedBlog();
  }

  ngOnChanges(changes: SimpleChanges){
    if(this.authService.isLogin==false){
      this.router.navigate(['/blog/']);
    }
    console.log(changes);
  }

  getMyBlog() {
    this.blogService.getBlogs().forEach(blog => {
      if (this.authorName == blog.author) {
        this.myFinalBlogs.push(blog);
      }
    })
  }

  getUpdatedBlog() {
    this.blogService.updateBlog.subscribe(() => {
      this.myFinalBlogs = [];
      this.authorName = this.authService.loginUserNameOrEmail;
      this.getMyBlog();
    });
  }

  onDetail(id: number) {
    this.router.navigate(
      ['blog/', + this.blogService.getBlogById(id)]
    );
  }

  onDelete(id: number) {
    this.blogService.deleteBlog(id);
  }

  onOpenEditModal(id: number) {
    const modalRef = this.modalService.open(EditblogsComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    (<EditblogsComponent>modalRef.componentInstance).dataToTakeAsInput =
      id;
    modalRef.result
      .then((result) => {
        console.log(" Model result : " + result);
      })
      .catch((result) => {
        console.log(" Model result : " + result);
      });
    this.blogService.editBlogModal = id;
  }
}
