import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task, TasksService} from '../shared/tasks.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateService} from '../shared/date.service';
import {TodoListComponent} from '../todo-list/todo-list.component';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit {
  form: FormGroup;

  @Output() onAdd: EventEmitter<Task> = new EventEmitter<Task>()

  constructor(private dateService: DateService,
              private tasksService: TasksService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  submit() {
    console.log(this.dateService.date);
    const {description, title} = this.form.value;
    const completed = false;
    const createdAt = this.dateService.date.format('DD-MM-YYYY HH:mm');
    const editedAt = this.dateService.date.format('DD-MM-YYYY HH:mm');
    const task: Task = {
      title,
      description,
      completed,
      createdAt,
      editedAt
    };
    this.tasksService.create(task)
      .subscribe((res) => {
        this.form.reset();
      }, err => console.error(err));
    this.onAdd.emit(task);
  }
}
