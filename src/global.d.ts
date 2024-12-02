declare const axios: {
  defaults: {
    withCredentials: boolean;
  };
  post: (url: string, data?: any, config?: any) => Promise<any>;
};
