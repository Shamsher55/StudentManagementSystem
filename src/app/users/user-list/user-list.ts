import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { AppUserItem } from '../user.model';
import { Auth } from '../../login/auth';
import { SchoolService } from '../../schools/school';
import { School } from '../../schools/school.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private service = inject(UserService);
  private auth    = inject(Auth);
  private schoolSvc = inject(SchoolService);
  private fb      = inject(FormBuilder);

  users: AppUserItem[] = [];
  schools: School[] = [];
  filtered: AppUserItem[] = [];
  search = '';
  filterRole = '';
  loading = true;
  errorMsg = '';

  // Add/Edit modal
  modalMode: 'add' | 'edit' | null = null;
  editUser: AppUserItem | null = null;
  showPassword = false;
  saving = false;
  modalError = '';
  modalSuccess = '';

  // Reset password modal
  resetTarget: AppUserItem | null = null;
  resetSaving = false;
  resetError = '';
  resetSuccess = '';
  showResetPwd = false;

  get isSuperAdmin() { return this.auth.isSuperAdmin(); }
  get schoolId()     { return this.auth.getSchoolId(); }

  roles = ['superadmin', 'admin', 'teacher', 'student'];

  userForm = this.fb.group({
    name:        ['', Validators.required],
    email:       ['', [Validators.required, Validators.email]],
    role:        ['admin', Validators.required],
    schoolId:    [null as number | null],
    password:    [''],
    changePassword: [false],
  });

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit() {
    this.load();
    if (this.isSuperAdmin) this.schoolSvc.getAll().subscribe(s => this.schools = s);
  }

  load() {
    this.loading = true;
    this.service.getAll(this.schoolId ?? undefined).subscribe({
      next: users => { this.users = users; this.applyFilter(); this.loading = false; },
      error: () => { this.errorMsg = 'Failed to load users.'; this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.users.filter(u => {
      const matchSearch = !this.search ||
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase());
      const matchRole = !this.filterRole || u.role === this.filterRole;
      return matchSearch && matchRole;
    });
  }

  onSearch(val: string)  { this.search = val; this.applyFilter(); }
  onFilter(val: string)  { this.filterRole = val; this.applyFilter(); }

  schoolName(id?: number) {
    return this.schools.find(s => s.id === id)?.name ?? '—';
  }

  openAdd() {
    this.modalMode = 'add';
    this.editUser = null;
    this.modalError = '';
    this.modalSuccess = '';
    this.showPassword = true;
    this.userForm.reset({ role: 'admin', changePassword: false, schoolId: this.schoolId });
    this.userForm.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')!.updateValueAndValidity();
  }

  openEdit(u: AppUserItem) {
    this.modalMode = 'edit';
    this.editUser = u;
    this.modalError = '';
    this.modalSuccess = '';
    this.showPassword = false;
    this.userForm.reset({ name: u.name, email: u.email, role: u.role, schoolId: u.schoolId ?? null, password: '', changePassword: false });
    this.userForm.get('password')!.clearValidators();
    this.userForm.get('password')!.updateValueAndValidity();
  }

  togglePasswordField() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.userForm.get('password')!.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.userForm.get('password')!.clearValidators();
      this.userForm.get('password')!.setValue('');
    }
    this.userForm.get('password')!.updateValueAndValidity();
  }

  saveUser() {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    const v = this.userForm.value;
    this.saving = true;
    this.modalError = '';

    if (this.modalMode === 'add') {
      this.service.register({ name: v.name!, email: v.email!, password: v.password!, role: v.role!, schoolId: v.schoolId ?? undefined }).subscribe({
        next: () => { this.modalSuccess = 'User created successfully.'; this.saving = false; this.load(); },
        error: err => { this.modalError = err?.error?.message ?? 'Failed to create user.'; this.saving = false; }
      });
    } else {
      const payload: any = { name: v.name, email: v.email, role: v.role, schoolId: v.schoolId ?? undefined };
      if (this.showPassword && v.password) payload.newPassword = v.password;
      this.service.update(this.editUser!.id, payload).subscribe({
        next: () => { this.modalSuccess = 'User updated successfully.'; this.saving = false; this.load(); },
        error: err => { this.modalError = err?.error?.message ?? 'Failed to update user.'; this.saving = false; }
      });
    }
  }

  closeModal() { this.modalMode = null; }

  openReset(u: AppUserItem) {
    this.resetTarget = u;
    this.resetError = '';
    this.resetSuccess = '';
    this.showResetPwd = false;
    this.resetForm.reset();
  }

  closeReset() { this.resetTarget = null; }

  submitReset() {
    if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
    this.resetSaving = true;
    this.resetError = '';
    this.service.resetPassword(this.resetTarget!.id, this.resetForm.value.newPassword!).subscribe({
      next: () => { this.resetSuccess = 'Password reset successfully.'; this.resetSaving = false; },
      error: err => { this.resetError = err?.error?.message ?? 'Failed to reset password.'; this.resetSaving = false; }
    });
  }

  deleteUser(u: AppUserItem) {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    this.service.delete(u.id).subscribe({
      next: () => this.load(),
      error: err => alert(err?.error?.message ?? 'Failed to delete user.')
    });
  }

  invalid(field: string, form: 'user' | 'reset' = 'user') {
    const c = form === 'user' ? this.userForm.get(field) : this.resetForm.get(field);
    return c?.invalid && c?.touched;
  }

  roleBadge(role: string) {
    const map: Record<string, string> = { superadmin: 'badge-super', admin: 'badge-admin', teacher: 'badge-teacher', student: 'badge-student' };
    return map[role] ?? '';
  }
}
