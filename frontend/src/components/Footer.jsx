const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} StartupAI. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            Terms of Service
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
