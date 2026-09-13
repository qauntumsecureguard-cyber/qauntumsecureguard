function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="fixed top-20 left-20 w-24 h-24 bg-yellow-400/20 rounded-full animate-pulse"></div>
      <div
        className="fixed bottom-20 right-20 w-16 h-16 bg-yellow-500/20 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      ></div>

      <div className="w-full max-w-md mx-auto py-10">
        {/* Card Container */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl w-full">
          {/* Decorative Elements */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-400/20 dark:bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "150ms" }}
          ></div>

          {/* Content */}
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout