import { AbstractControl, FormGroup, FormArray } from '@angular/forms';

export function updateFormDirtyTouched(control: AbstractControl): void {
  if (control instanceof FormGroup || control instanceof FormArray) {
    Object.values(control.controls).forEach(childControl =>
      marcarTodoComoTocadoYDirty(childControl)
    );
  }

  control.markAsTouched({ onlySelf: true });
  control.markAsDirty({ onlySelf: true });
}
