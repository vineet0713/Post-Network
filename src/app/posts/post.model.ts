// export class Post {
// 	constructor(public title: string, public content: string) {}
// }

export interface Post {
	id?: string;
	title: string;
	content: string;
	image?: File;
	imagePath?: string;
}