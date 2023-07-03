import { FallbackProps } from 'react-error-boundary';
const ErrorMessage = ({ error }: FallbackProps) => {
  return (
    <div className="rounded bg-red-200 p-4 shadow-md">
      <h2 className="mb-3 w-full border-b-2 border-red-300 text-lg font-medium text-red-600">
        エラーが発生しました
      </h2>
      <pre className="px-2">{error.message}</pre>
    </div>
  );
};
export default ErrorMessage;
