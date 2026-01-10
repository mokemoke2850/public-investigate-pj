import { PreAuthenticationTriggerHandler } from 'aws-lambda';

export const handler: PreAuthenticationTriggerHandler = async (event) => {
  const { userAttributes } = event.request;
  const lastChange = userAttributes['custom:last_password_change'];

  // 0. 初期登録時など、属性が存在しない場合のハンドリング
  // ここを通さないと、初回ログインが不可能になるため「致命的な不確定要素」を避ける実装にします
  if (!lastChange) {
    return event;
  }

  // 1. ログインしているユーザの有効期限情報を計算
  const lastChangeDate = new Date(lastChange);
  const now = new Date();

  // ミリ秒単位の差分を日にちに変換
  const diffTime = Math.abs(now.getTime() - lastChangeDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. 90日以内であればOKとしてリターン
  if (diffDays <= 90) {
    return event;
  }

  // 3. 90日を超えている場合、エラーを投げて認証を失敗させる
  // フロントエンドでこの文字列を検知してリダイレクト処理を行います
  throw new Error('PASSWORD_EXPIRED_ERROR');
};
