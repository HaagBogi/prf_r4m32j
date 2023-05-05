import { MainClass } from '../main_class';

import { NextFunction, Request, Response } from 'express';
import { User } from '../model/User';

module.exports = (passport: any, router: any) => {

    router.get('/', (req: Request, res: Response) => {
        res.status(404).send('This is not an available route, please try /promise or /observable.');
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (err: any, user: any) => {
            if (err) {
                res.status(500).send('Internal server error.');
            } else {
                req.login(user, (error) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send('Incorrect username or password.');
                    } else {
                        res.status(200).send(user);
                    }
                });
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = new User({email: email, password: password});
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            req.logout();
            res.status(200).send('Successfully logged out.');
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.get('/promise', async (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.write('Waiting for the result from Promise...\n');
        myClass.greetingPromise().then((data: string) => {
            res.write(data);
            res.status(200).end();
        }).catch((error: string) => {
            res.write(error);
            res.status(404).end();
        });

        /*
        // async-await (same as Promise above)
        try {
            const data = await myClass.greetingPromise();
            res.write(data);
            res.status(200).end();
        } catch (error: any) {
            res.write(error);
            res.status(404).end();
        } */
    });

    router.get('/observable', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        myClass.greetingObservable().subscribe((data: string) => {
            res.write(data);
        }, (error: string) => {
            res.status(404).end(error);
        }, () => {
            res.status(200).end();
        });
    });

    return router;

};
