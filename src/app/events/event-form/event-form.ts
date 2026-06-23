import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService } from '../event';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="form-page">
  <div class="form-card">
    <h2>{{ editId ? 'Edit' : 'Add' }} Event</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="form-grid">
        <div class="field full"><label>Title *</label>
          <input formControlName="title" placeholder="Event title" /></div>
        <div class="field"><label>Type *</label>
          <select formControlName="type">
            <option value="holiday">Holiday</option>
            <option value="exam">Exam</option>
            <option value="event">Event</option>
            <option value="meeting">Meeting</option>
            <option value="sports">Sports</option>
          </select></div>
        <div class="field"><label>Date *</label>
          <input formControlName="date" type="date" /></div>
        <div class="field"><label>End Date (optional)</label>
          <input formControlName="endDate" type="date" /></div>
        <div class="field full"><label>Description *</label>
          <textarea formControlName="description" rows="3" placeholder="Event description"></textarea></div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancel()">Cancel</button>
        <button type="submit" class="btn-submit">{{ editId ? 'Save' : 'Add Event' }}</button>
      </div>
    </form>
  </div>
</div>`,
  styles: [`
.form-page { padding: 24px; }
.form-card { background: white; border-radius: 12px; padding: 28px; max-width: 600px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
h2 { margin: 0 0 20px; color: #1a237e; font-size: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field.full { grid-column: 1 / -1; }
label { font-size: 13px; font-weight: 600; color: #444; }
input, select, textarea { padding: 9px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; width: 100%; box-sizing: border-box; }
input:focus, select:focus, textarea:focus { outline: none; border-color: #1a237e; }
textarea { resize: vertical; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-cancel { padding: 10px 20px; border: 1px solid #ddd; border-radius: 8px; background: white; cursor: pointer; }
.btn-submit { padding: 10px 24px; border: none; border-radius: 8px; background: #1a237e; color: white; cursor: pointer; font-weight: 600; }
@media(max-width:600px) { .form-grid { grid-template-columns: 1fr; } .field.full { grid-column: 1; } }
`],
})
export class EventForm implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(EventService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  editId: number | null = null;

  form = this.fb.group({
    title:       ['', Validators.required],
    type:        ['event', Validators.required],
    date:        ['', Validators.required],
    endDate:     [''],
    description: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.editId = +id; const e = this.service.getById(+id); if (e) this.form.patchValue(e as any); }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;
    this.editId ? this.service.update(this.editId, v) : this.service.add(v);
    this.router.navigate(['/events']);
  }

  cancel() { this.router.navigate(['/events']); }
}
