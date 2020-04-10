import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
  editedAt?: string;
}

export interface CreateResponse {
  name: string;
}

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': ''})
};

@Injectable({ providedIn: 'root' })

export class TasksService {

  static url = 'https://my-todo-7917a.firebaseio.com/tasks';

  public listIsChanged = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }

  load(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return;
        }
        return Object.keys(tasks).map(key => ({...tasks[key], id: key}));
      }));
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}.json`, task)
      .pipe(map(res => {
        const newTask = {...task, id: res.name};
        this.listIsChanged.next(newTask);
        return newTask;
      }));
  }

  edit(task: Task): Observable<any> {
    return this.http.put(`${TasksService.url}/${task.id}.json`, task, httpOptions);
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${TasksService.url}/${task.id}.json`);
  }
}
