import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from '../teacher';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="form-page">
  <div class="form-card">
    <h2>{{ editId ? 'Edit' : 'Add' }} Teacher</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-grid">
        <div class="field"><label>Full Name *</label>
          <input formControlName="name" placeholder="Full name" /></div>
        <div class="field"><label>Email *</label>
          <input formControlName="email" type="email" placeholder="teacher@sms.edu" /></div>
        <div class="field"><label>Phone *</label>
          <input formControlName="phone" placeholder="05XXXXXXXX" /></div>
        <div class="field"><label>Subject *</label>
          <input formControlName="subject" placeholder="e.g. Web Development" /></div>
        <div class="field"><label>Qualification *</label>
          <input formControlName="qualification" placeholder="e.g. MSc Computer Science" /></div>
        <div class="field"><label>Joining Date *</label>
          <input formControlName="joiningDate" type="date" /></div>
        <div class="field"><label>Status</label>
          <select formControlName="status">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select></div>
        <div class="field full"><label>Assigned Courses (comma-separated)</label>
          <input formControlName="coursesStr" placeholder="HTML & CSS, Angular Framework, ..." /></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
        <button type="submit" class="btn-submit">{{ editId ? 'Save' : 'Add Teacher' }}</button>
      </div>
    </form>
  </div>
</div>`,
  styles: [`
.form-page { padding: 24px; }
.form-card { background: white; border-radius: 12px; padding: 28px; max-width: 700px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
h2 { margin: 0 0 20px; color: #1a237e; font-size: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field.full { grid-column: 1 / -1; }
label { font-size: 13px; font-weight: 600; color: #444; }
input, select { padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }
input:focus, select:focus { outline: none; border-color: #1a237e; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
.btn-submit { padding: 10px 24px; border: none; border-radius: 8px; background: #1a237e; color: white; cursor: pointer; font-weight: 600; }
@media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: 1; } }
`],
})
export class TeacherForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(TeacherService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  editId: number | null = null;

  form = this.fb.group({
    name:          ['', Validators.required],
    email:         ['', [Validators.required, Validators.email]],
    phone:         ['', Validators.required],
    subject:       ['', Validators.required],
    qualification: ['', Validators.required],
    joiningDate:   ['', Validators.required],
    status:        ['active'],
    coursesStr:    [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      const t = this.service.getById(+id);
      if (t) this.form.patchValue({ ...t, coursesStr: t.courses.join(', ') } as any);
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;
    const data = { ...v, courses: v.coursesStr ? v.coursesStr.split(',').map((s: string) => s.trim()).filter(Boolean) : [] };
    delete data.coursesStr;
    this.editId ? this.service.update(this.editId, data) : this.service.add(data);
    this.router.navigate(['/teachers']);
  }

  cancel() { this.router.navigate(['/teachers']); }
}
