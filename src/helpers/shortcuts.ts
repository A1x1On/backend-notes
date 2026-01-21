export const setError = (ctx: IContextMeta, code: number) => {
  (ctx.meta as IContextMeta).$statusCode = code;
};
