import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchoolService } from '../school';

@Component({
  selector: 'app-school-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './school-form.html',
  styleUrl: './school-form.css',
})
export class SchoolForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(SchoolService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  editId: number | null = null;
  get isEdit() { return this.editId !== null; }

  form = this.fb.group({
    name:            ['', Validators.required],
    code:            ['', [Validators.required, Validators.maxLength(5)]],
    address:         ['', Validators.required],
    city:            ['', Validators.required],
    phone:           ['', Validators.required],
    email:           ['', [Validators.required, Validators.email]],
    principalName:   ['', Validators.required],
    establishedYear: [2020, Validators.required],
    status:          ['active'],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      const s = this.service.getById(+id);
      if (s) this.form.patchValue(s as any);
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;
    this.isEdit ? this.service.update(this.editId!, v) : this.service.add(v);
    this.router.navigate(['/schools']);
  }

  cancel() { this.router.navigate(['/schools']); }
  invalid(f: string) { const c = this.form.get(f); return c?.invalid && c?.touched; }
}
