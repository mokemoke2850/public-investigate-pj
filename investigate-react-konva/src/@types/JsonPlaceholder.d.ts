export interface User {
  id: number;
  name: string;
  userName: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface UserAndTodo {
  id: number;
  title: string;
  completed: boolean;
  user: User | undefined;
}
