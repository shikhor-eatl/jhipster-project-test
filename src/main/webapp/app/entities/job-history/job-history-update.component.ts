import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IJobHistory, JobHistory } from 'app/shared/model/job-history.model';
import { JobHistoryService } from './job-history.service';
import { IJob } from 'app/shared/model/job.model';
import { JobService } from 'app/entities/job/job.service';
import { IDepartment } from 'app/shared/model/department.model';
import { DepartmentService } from 'app/entities/department/department.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';

@Component({
  selector: 'jhi-job-history-update',
  templateUrl: './job-history-update.component.html'
})
export class JobHistoryUpdateComponent implements OnInit {
  isSaving: boolean;

  jobs: IJob[];

  departments: IDepartment[];

  employees: IEmployee[];

  editForm = this.fb.group({
    id: [],
    startDate: [],
    endDate: [],
    language: [],
    jobId: [],
    departmentId: [],
    employeeId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected jobHistoryService: JobHistoryService,
    protected jobService: JobService,
    protected departmentService: DepartmentService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ jobHistory }) => {
      this.updateForm(jobHistory);
    });
    this.jobService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IJob[]>) => mayBeOk.ok),
        map((response: HttpResponse<IJob[]>) => response.body)
      )
      .subscribe(
        (res: IJob[]) => {
          if (!this.editForm.get('jobId').value) {
            this.jobs = res;
          } else {
            this.jobService
              .find(this.editForm.get('jobId').value)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IJob>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IJob>) => subResponse.body)
              )
              .subscribe((subRes: IJob) => (this.jobs = [subRes].concat(res)), (subRes: HttpErrorResponse) => this.onError(subRes.message));
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.departmentService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IDepartment[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDepartment[]>) => response.body)
      )
      .subscribe(
        (res: IDepartment[]) => {
          if (!this.editForm.get('departmentId').value) {
            this.departments = res;
          } else {
            this.departmentService
              .find(this.editForm.get('departmentId').value)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IDepartment>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IDepartment>) => subResponse.body)
              )
              .subscribe(
                (subRes: IDepartment) => (this.departments = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.employeeService
      .query({ filter: 'jobhistory-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployee[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployee[]>) => response.body)
      )
      .subscribe(
        (res: IEmployee[]) => {
          if (!this.editForm.get('employeeId').value) {
            this.employees = res;
          } else {
            this.employeeService
              .find(this.editForm.get('employeeId').value)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IEmployee>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IEmployee>) => subResponse.body)
              )
              .subscribe(
                (subRes: IEmployee) => (this.employees = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(jobHistory: IJobHistory) {
    this.editForm.patchValue({
      id: jobHistory.id,
      startDate: jobHistory.startDate != null ? jobHistory.startDate.format(DATE_TIME_FORMAT) : null,
      endDate: jobHistory.endDate != null ? jobHistory.endDate.format(DATE_TIME_FORMAT) : null,
      language: jobHistory.language,
      jobId: jobHistory.jobId,
      departmentId: jobHistory.departmentId,
      employeeId: jobHistory.employeeId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const jobHistory = this.createFromForm();
    if (jobHistory.id !== undefined) {
      this.subscribeToSaveResponse(this.jobHistoryService.update(jobHistory));
    } else {
      this.subscribeToSaveResponse(this.jobHistoryService.create(jobHistory));
    }
  }

  private createFromForm(): IJobHistory {
    return {
      ...new JobHistory(),
      id: this.editForm.get(['id']).value,
      startDate:
        this.editForm.get(['startDate']).value != null ? moment(this.editForm.get(['startDate']).value, DATE_TIME_FORMAT) : undefined,
      endDate: this.editForm.get(['endDate']).value != null ? moment(this.editForm.get(['endDate']).value, DATE_TIME_FORMAT) : undefined,
      language: this.editForm.get(['language']).value,
      jobId: this.editForm.get(['jobId']).value,
      departmentId: this.editForm.get(['departmentId']).value,
      employeeId: this.editForm.get(['employeeId']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobHistory>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackJobById(index: number, item: IJob) {
    return item.id;
  }

  trackDepartmentById(index: number, item: IDepartment) {
    return item.id;
  }

  trackEmployeeById(index: number, item: IEmployee) {
    return item.id;
  }
}
