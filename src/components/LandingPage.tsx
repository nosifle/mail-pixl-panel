import React from 'react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-medium text-gray-900">Logo</span>
            </div>
            
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Link</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Link</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Link</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Link</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Title
          </h1>
          <Button className="bg-gray-900 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800">
            Button
          </Button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Another Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Card Title</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Final Section Title
          </h2>
          <Button className="bg-white text-gray-900 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100">
            Button
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;