import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {

  prop: number;

  constructor() { }

  ngOnInit() {
    this.createObservableObj()
      .pipe(
        map(value => value * 2),
        filter(value => value > 4)
      )
      .subscribe({
          next: (value) => {
            console.log('observable next', value);
            this.prop = value;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('observable complete');
          }
        }
      );
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

  generateUnlimitedStream(): void {
    const observable: Observable<number> = Observable.create((observer: Observer<number>) => {
      let notifyValue = 0;

      const intervalId = setInterval(() => {
        observer.next(notifyValue);
        notifyValue++;

        // ブラウザが固まらないように制限を入れています
        if (notifyValue > 100) {
          clearInterval(intervalId);
        }
      }, 1000);
    });

    const sub = observable.subscribe(val => console.log('unlimited stream', val));
    setTimeout(() => {
      sub.unsubscribe();
    }, 1500);
  }
}
