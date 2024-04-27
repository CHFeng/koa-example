export default {
  httpResponse: (ctx, httpStatus, meta) => {
    const result = httpStatus !== 200 ? 'failed' : 'success';
    ctx.status = httpStatus;
    ctx.body = { result, ...meta };
  },
};
