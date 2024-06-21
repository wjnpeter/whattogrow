/** 
 * FIXME: 如果用apiHandler调用 就会出现：
 * API resolved without sending a response。。。
 * 因为requestHandler已经返回了 但getData还没完成
*/

const apiHandler = (res, method, handlers) => {
  if (!Object.keys(handlers).includes(method)) {
    res.setHeader('Allow', Object.keys(handlers))
    res.status(405).end(`Method ${method} Not Allowed`)
  } else {
    handlers[method](res)
  }
}

export default apiHandler;