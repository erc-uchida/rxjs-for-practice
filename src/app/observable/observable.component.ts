import { Component, OnInit } from '@angular/core';
import { from, Observable, Observer } from 'rxjs';
import { concatMap, filter, finalize, map, tap } from 'rxjs/operators';

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

  onClick(): void {
    from([
      this.proc1(),
      this.proc2(),
      this.procNull(),
      this.proc3()
    ]).pipe(
      filter(val => {
        console.log('filter');
        return val !== null;
      }),
      tap(val => {
        console.log('tap');
        return val;
      }),
      concatMap(val => {
        console.log('concatMap');
        return val;
      }),
      finalize(() => {
        console.log('finalize');
      })
    ).subscribe();
  }

  private proc1(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      setTimeout(() => {
        // なんか処理する...
        console.log('proc1 complete');
        o.complete();
      }, 5000);
    });
  }

  private proc2(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      setTimeout(() => {
        // なんか処理する...
        console.log('proc2 complete');
        o.complete();
      }, 1000);
    });
  }

  private proc3(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      setTimeout(() => {
        // なんか処理する...
        console.log('proc3 complete');
        o.complete();
      }, 3000);
    });
  }

  private procNull(): Observable<null> | null {
    return null;
  }
}
