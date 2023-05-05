import { Observable, Subscriber } from 'rxjs';

export class MainClass {

    securityThreshold: number = 70;

	constructor() {
		console.log('Works');
	}

    greetingPromise(): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const randAvailability = Math.random() * 100;
                if (randAvailability < this.securityThreshold) {
                    resolve('Successful request, availability is: ' + (100-randAvailability).toString() + '%');
                } else {
                    reject('Error: availability is only ' + (100-randAvailability).toString() + '%');
                }            
            }, 3000);
        });
    }

    greetingObservable(): Observable<string> {
        // a counter for giving a maximum threshold for setInterval()
        let counter = 0;
        return new Observable((subscriber: Subscriber<string>) => {
            subscriber.next('Waiting for the response from Observable...');
            const interval = setInterval(() => {
                const randAvailability = Math.random() * 100;
                if (randAvailability < this.securityThreshold) {
                    subscriber.next('Successful request, availability is: ' + (100-randAvailability).toString() + '%');
                } else {
                    subscriber.error('Error: availability is only ' + (100-randAvailability).toString() + '%');
                }
                if (counter == 5) {
                    clearInterval(interval);
                    subscriber.complete();
                }
            }, 2000);
        });
    } 
    
}
