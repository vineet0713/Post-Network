import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: PostListComponent,
	},
	{
		path: 'create',
		component: PostCreateComponent,
		canActivate: [AuthGuard],		// user must be authenticated to access this route!
	},
	{
		path: 'edit/:postId',
		component: PostCreateComponent,
		canActivate: [AuthGuard],		// user must be authenticated to access this route!
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [AuthGuard],		// user must not be authenticated to access this route!
	},
	{
		path: 'signup',
		component: LoginComponent,
		canActivate: [AuthGuard],		// user must not be authenticated to access this route!
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers: [AuthGuard],
})
export class AppRoutingModule { }