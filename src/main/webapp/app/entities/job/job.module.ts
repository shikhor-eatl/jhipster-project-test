import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipstertestSharedModule } from 'app/shared/shared.module';
import { JobComponent } from './job.component';
import { JobDetailComponent } from './job-detail.component';
import { JobUpdateComponent } from './job-update.component';
import { JobDeletePopupComponent, JobDeleteDialogComponent } from './job-delete-dialog.component';
import { jobRoute, jobPopupRoute } from './job.route';

const ENTITY_STATES = [...jobRoute, ...jobPopupRoute];

@NgModule({
  imports: [JhipstertestSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [JobComponent, JobDetailComponent, JobUpdateComponent, JobDeleteDialogComponent, JobDeletePopupComponent],
  entryComponents: [JobDeleteDialogComponent]
})
export class JhipstertestJobModule {}
