import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((fUser) => {
      console.log(fUser);
    });
  }

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
