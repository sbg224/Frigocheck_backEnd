export interface thingsUsers {
	id?: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	birth_day: Date;
}

export interface thingsProduct {
	id: number;
	designation: string;
	user_id: number;
	type_id: number;
	genre_id: number;
	quantite: number;
}

export interface thingsOrder {
	id: number;
	g_name: string;
	t_name: string;
}
