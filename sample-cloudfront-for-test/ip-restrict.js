function handler(event) {
  const request = event.request;
  const clientIP = event.viewer.ip;

  // 許可するIPアドレスのリスト
  const allowedIPs = ['203.0.113.1', '198.51.100.2'];

  // クライアントのIPアドレスが許可リストにあるか確認
  const isAllowed = allowedIPs.includes(clientIP);

  if (!isAllowed) {
    // 許可されていないIPアドレスの場合、403 Forbiddenを返す
    const response = {
      statusCode: 403,
      statusDescription: 'Forbidden',
      headers: {
        'content-type': { value: 'text/html' },
        'cache-control': { value: 'no-cache, no-store, must-revalidate' },
      },
      body: 'Access denied',
    };
    return response;
  }

  // 許可されたIPアドレスの場合、リクエストをそのまま続行
  return request;
}
