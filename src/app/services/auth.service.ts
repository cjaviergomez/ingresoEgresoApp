import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Usuario } from '../models/usuario.model';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSubscription: Subscription = new Subscription();

  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fUser) => {
      console.log(fUser);
      if (fUser) {
        // Existe el usuario
        this.userSubscription = this.firestore
          .doc(`${fUser.uid}/usuario`)
          .valueChanges()
          .subscribe((fireStoreUser: any) => {
            const user = Usuario.fireStoreUser(fireStoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
        // No existe
        // Cancelar la subscripción y llamar el unSetUsuario
        this.userSubscription.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  // Método para crear un usuario tanto en FireBase Auth como en el FireStore.
  crearUsuario(nombre: string, correo: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(correo, password)
      .then(({ user }) => {
        const nuevoUsuario = new Usuario(user.uid, nombre, correo);
        return this.firestore
          .doc(`${user.uid}/usuario`)
          .set({ ...nuevoUsuario });
      });
  }

  loginUsuario(correo: string, password: string) {
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logOut() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fUser) => fUser != null));
  }
}
