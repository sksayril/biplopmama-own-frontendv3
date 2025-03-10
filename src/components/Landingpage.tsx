import React from 'react';
import { MapPin, Users, BadgeCheck, ArrowRight, Search, Building, Database, Shield, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import image1 from '../assets/leadssecondimage.jpg';
import image2 from '../assets/historyimage3.jpg';   
import image3 from '../assets/userprofileimage1.jpg';
interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  // For the screenshots carousel/slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Sample screenshots - replace these placeholder URLs with your actual screenshots
  const screenshots = [
    image1, // Replace with your actual screenshot paths
    image2,
    image3,
  ];
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-bounce mb-8 inline-flex items-center justify-center p-4 bg-blue-500 rounded-full">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Transform Your B2B Sales with <span className="text-blue-200">Verified Leads</span>
            </h1>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Access 150 high-quality, verified business leads from Google Maps for just $199. 
              Supercharge your sales pipeline with accurate data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              {/* <button className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-400 transition-all transform hover:scale-105">
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshot Showcase Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See Our Platform in Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover how easy it is to find, filter, and export high-quality B2B leads with our intuitive platform.
            </p>
          </div>
          
          {/* Screenshots Carousel */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Main Screenshot Display */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={screenshots[currentImageIndex]} 
                alt={`Platform screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Screenshot Description Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-2">
                  {currentImageIndex === 0 && "Search & Filter Business Leads"}
                  {currentImageIndex === 1 && "View Detailed Business Profiles"}
                  {currentImageIndex === 2 && "Export Data in Multiple Formats"}
                </h3>
                <p className="text-white/80">
                  {currentImageIndex === 0 && "Easily find the right businesses using our powerful search and filtering tools."}
                  {currentImageIndex === 1 && "Access comprehensive information about each business including contacts and location data."}
                  {currentImageIndex === 2 && "Export your selected leads in CSV, Excel, or other formats with a single click."}
                </p>
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 p-3 rounded-full shadow-lg transform transition-transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-blue-600 p-3 rounded-full shadow-lg transform transition-transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Screenshot Indicators */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
              {screenshots.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  aria-label={`View screenshot ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Caption Under Screenshots */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 italic">
              Our easy-to-use platform puts verified business leads at your fingertips
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our B2B Lead Service?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get access to premium business data that's verified and ready for your sales team to use.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Google Maps Verified</h3>
              <p className="text-gray-600 leading-relaxed">
                Every business lead is verified through Google Maps, ensuring you get accurate location and contact details.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality B2B Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Access comprehensive business profiles including industry, size, and key decision-makers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Regular Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Our database is continuously updated to ensure you always have the latest business information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting high-quality B2B leads is simple with our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 relative z-10">
                  <span className="text-blue-600 text-3xl font-bold">1</span>
                </div>
                <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-blue-100 -z-0"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Purchase Access</h3>
              <p className="text-gray-600">
                Make a one-time payment of ₹199 to gain immediate access to our verified business leads.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 relative z-10">
                  <span className="text-blue-600 text-3xl font-bold">2</span>
                </div>
                <div className="hidden md:block absolute top-12 left-full w-full h-1 bg-blue-100 -z-0"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse & Filter</h3>
              <p className="text-gray-600">
                Use our intuitive dashboard to search, filter, and find the exact business leads you need.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6 relative z-10">
                  <span className="text-blue-600 text-3xl font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Export & Use</h3>
              <p className="text-gray-600">
                Download your selected leads in your preferred format and start reaching out to potential clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Start growing your business today with verified leads</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all">
            <div className="bg-blue-600 p-8 text-center">
              <div className="inline-block bg-blue-500 rounded-full px-6 py-2 text-white text-sm font-semibold mb-4">
                MOST POPULAR
              </div>
              <div className="text-white mb-4">
                <span className="text-6xl font-bold">₹199</span>
                <span className="text-xl">/one-time</span>
              </div>
              <p className="text-blue-100 text-xl">150 Verified Business Leads</p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <span>100% verified business data</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Complete contact information</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <BadgeCheck className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Export in CSV/Excel format</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                  <span>Detailed location data</span>
                </li>
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center group"
              >
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}