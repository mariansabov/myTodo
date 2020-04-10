import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DateService} from '../shared/date.service';
import {TasksService, Task} from '../shared/tasks.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {timeInterval} from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  public form: FormGroup;

  public tasksList: Task[] = [];

  public edit = false;

  public taskForEdit: Task = {
    title: '',
    description: '',
    id: '',
  };

  constructor(private taskService: TasksService,
              private dateService: DateService) {
    this.taskService.listIsChanged
      .subscribe((res: Task) => {
        if (res) {
          this.tasksList.push(res);
        }
      });
  }

  ngOnInit() {
    this.taskService.load().subscribe( (tasks: Task[]) => {
        this.tasksList = tasks;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(() => {
      this.tasksList = this.tasksList.filter(t => t.id !== task.id);
    }, error => console.error(error));
  }

  switchEdit(task: Task) {
    this.edit = true;
    console.log(task.id);
    this.taskForEdit = task;
    console.log( this.taskForEdit);
  }

  switchEdit2() {
    this.edit = false;
  }

  editTask(taskForEdit: Task) {
    const {description, title} = this.form.value;
    const editedAt = this.dateService.date.format('DD-MM-YYYY HH:mm');
    const createdAt = taskForEdit.createdAt;
    const completed = false;
    const id = taskForEdit.id;
    const task: Task = {
      title,
      description,
      editedAt,
      createdAt,
      completed,
      id
    };
    this.taskService.edit(task)
      .subscribe((res) => {
        this.form.reset();
        this.taskService.load().subscribe( (tasks: Task[]) => {
          this.tasksList = tasks;
        });
      }, err => console.error(err));
  }

}
