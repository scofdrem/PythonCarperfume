import { useSearchParams, Link } from 'react-router-dom';

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error') || 'An unknown authentication error occurred.';

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold mb-2">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">{decodeURIComponent(error)}</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default AuthError;