import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {

  prop: number;

  constructor() { }

  ngOnInit() {
    this.createObservableObj().subscribe({
      next: (value) => {
        this.prop = value;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('observable complete');
      }
    });
  }

  createObservableObj(): Observable<number> {
    return Observable.create((observer: Observer<number>) => {
      let notifyValue = 0;

      const intervalId = setInterval(() => {
        if (notifyValue === 5) {
          clearInterval(intervalId);
          observer.complete();
        }

        observer.next(notifyValue);
        notifyValue++;
      }, 1000);

    });
  }
}
