import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    constructor(private matDialog: MatDialog) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {
        openEditCourseDialog(this.matDialog,course)
            .pipe(
                filter( val => !!val)
            )
            .subscribe({
                next: (val) => console.log(val)
            });
    }

}









