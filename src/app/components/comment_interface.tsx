export interface Comment {
    _id: string;
    user: {
      _id: string;
      username: string;
    };
    content: string;
    product: string;
    createdAt: string;
  }
  