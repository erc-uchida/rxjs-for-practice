import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { from, Observable, Observer, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, finalize, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.css']
})
export class ObservableComponent implements OnInit {

  prop: number;

  constructor(private httpClient: HttpClient) { }

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

  handleUnexpectedError(): void {
    from([
      this.procSuccess1(),
      this.procError1(),
      this.procSuccess2()
    ]).pipe(
      concatMap(val => {
        console.log('@@@ concatMap');
        return val;
      }),
      catchError(err => {
        console.log('@@@ catchError');
        // throw err;
        return throwError(err);
      })
    ).subscribe({
      next: (val) => {
        console.log('@@@ subscribe next', val);
      },
      error: (err) => {
        console.log('@@@ subscribe error', err);
        throw err;
      },
      complete: () => {
        console.log('@@@ subscribe complete');
      }
    });
  }

  private procSuccess1(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      // 何か処理する....
      console.log('@@@ proc success 1');
      o.complete();
    });
  }

  private procSuccess2(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      // 何か処理する....
      console.log('@@@ proc success 2');
      o.complete();
    });
  }

  private procError1(): Observable<null> {
    return Observable.create((o: Observer<null>) => {
      // 何か処理する....
      throw new Error('happened on procError1');
    });
  }

  handleUnexpectedError2(): void {
    from([
      this.procNestedObservable()
    ]).pipe(
      concatMap(val => {
        console.log('@@@ concatMap');
        return val;
      }),
      catchError(err => {
        console.log('@@@ catchError');
        return throwError(err);
      })
    ).subscribe({
      next: (val) => {
        console.log('@@@ subscribe next', val);
      },
      error: (err) => {
        console.log('@@@ subscribe error', err);
      },
      complete: () => {
        console.log('@@@ subscribe complete');
      }
    });
  }

  private procNestedObservable(): Observable<null> {
    return Observable.create((o: Observer<null>) => {

      from([
        this.procError1()
      ]).pipe(
        concatMap(val => {
          console.log('@@@ nested concatMap');
          return val;
        }),
        catchError(err => {
          console.log('@@@ nested catchError');
          return throwError(err);
        })
      ).subscribe({
        next: (val) => {
          console.log('@@@ nested subscribe next', val);
        },
        complete: () => {
          console.log('@@@ nested subscribe complete');
          o.complete();
        }
      });

    });
  }

  handleUnexpectedError3(): void {
    from([
      this.procNestedObservable2()
    ]).pipe(
      concatMap(val => {
        console.log('@@@ concatMap');
        return val;
      }),
      catchError(err => {
        console.log('@@@ catchError');
        return throwError(err);
      })
    ).subscribe({
      next: (val) => {
        console.log('@@@ subscribe next', val);
      },
      error: (err) => {
        console.log('@@@ subscribe error', err);
      },
      complete: () => {
        console.log('@@@ subscribe complete');
      }
    });
  }

  private procNestedObservable2(): Observable<null> {
    return Observable.create((o: Observer<null>) => {

      from([
        this.procApiRequest()
      ]).pipe(
        concatMap(val => {
          console.log('@@@ nested concatMap');
          return val;
        }),
        catchError(err => {
          console.log('@@@ nested catchError');
          return of(err);
        })
      ).subscribe({
        next: (val) => {
          console.log('@@@ nested subscribe next', val);
        },
        complete: () => {
          console.log('@@@ nested subscribe complete');
          o.complete();
        }
      });

    });
  }

  private procApiRequest(): Observable<any> {
    // もちろんローカルサーバーなどないのでエラーが発生します
    return this.httpClient.get('http://localhost:4200/example');
  }
}
