import {AfterViewInit, Component, ElementRef, InjectionToken, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {Course} from "../model/course";
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, fromEvent} from "rxjs";
import { Lesson } from '../model/lesson';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {
    course:Course;
    displayedColumns: string[] = [
      'select',
      'seqNo',
      'description',
      'duration'
    ]
    expandedLesson: Lesson = null;
    lessons: Lesson[] = [];
    loading: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    selection = new SelectionModel<Lesson>(true, []);
    @ViewChild(MatSort) sort: MatSort;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data["course"];
        this.loadLessonsPage() 
    }

    ngAfterViewInit() {

      this.sort.sortChange
        .subscribe(() => this.paginator.pageIndex = 0)
      
        merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadLessonsPage())
        )
        .subscribe()

    }

    isAllSelected(): boolean{
      if(!this.selection.hasValue()) {
        return false;
      }
      return this.selection.selected?.length === this.lessons?.length;
    }

    loadLessonsPage(): void{
      this.loading = true;
      this.coursesService.findLessons(this.course.id, 
                                      this.sort?.direction, 
                                      this.paginator?.pageIndex, 
                                      this.paginator?.pageSize,
                                      this.sort?.active)
        .pipe(
          tap(lessons => this.lessons = lessons),
          finalize(()=> this.loading = false)
        )
        .subscribe()
    }

    onLessonToggled(lesson:Lesson): void{
      this.selection.toggle(lesson);
    }
    
    onToggleLesson(lesson: Lesson): void{
      if(lesson.id === this.expandedLesson?.id){
        this.expandedLesson = null;
      }else{
        this.expandedLesson = lesson;
      }
    }

    toggleAll(){
      if(this.isAllSelected()){
        this.selection.clear();
      }else{
        this.selection.select(...this.lessons)
      }
      
    }

}
