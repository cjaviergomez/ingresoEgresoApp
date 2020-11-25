import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicios
import { AuthService } from '../../services/auth.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  formRegister: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  onSubmit(): void {
    if (this.formRegister.invalid) {
      return;
    }

    const { nombre, correo, password } = this.formRegister.value;

    this.store.dispatch(ui.isLoading());
    // Mostrar el loading
    // Swal.fire({
    //   title: 'Espere...',
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    this.authService
      .crearUsuario(nombre, correo, password)
      .then((credenciales) => {
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: '...ooops',
          text: err.message,
        });
      });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.uiSubscription.unsubscribe();
  }
}
