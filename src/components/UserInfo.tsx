import { useUserInfo } from '../hooks/useOpenAiGlobal';

export function UserInfo() {
  const user = useUserInfo();

  // Don't render if no user info available
  if (!user || (!user.first_name && !user.last_name && !user.email)) {
    return null;
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
        {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
      </div>

      {/* User details */}
      <div className="flex-1 min-w-0">
        {fullName && (
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {fullName}
          </p>
        )}
        {user.email && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}
