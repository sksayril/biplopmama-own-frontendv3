import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Download, CheckCircle, MapPin, Search, ChevronLeft, ChevronRight, AlertCircle, X, Trash2, CreditCard } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import UserSection from './UserSection';

interface Lead {
  title: string;
  link: string;
  stars: number;
  reviews: number;
  phone: string | null;
  website?: string;
  id?: string; // Added to help with deduplication
}

interface ScrapeResponse {
  message: string;
  data: Lead[];
  extractedCount: number;
  remainingCredits: number;
  error?: string;
}

interface LeadGeneratorProps {
  user?: any;
  onSwitchSection?: (section: string, props?: any) => void;
}

const itemsPerPage = 10;

const LeadGenerator: React.FC<LeadGeneratorProps> = ({ user, onSwitchSection }) => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [credits, setCredits] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string>('');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Use a ref to keep track of seen leads to prevent duplicates
  const seenLeadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserToken(token);
      fetchCredits(token);
    } else {
      setError('User token not found. Please log in again.');
    }

    // Try to load saved leads from localStorage
    const savedLeads = localStorage.getItem('savedLeads');
    if (savedLeads) {
      try {
        const parsedLeads = JSON.parse(savedLeads) as Lead[];
        setAllLeads(parsedLeads);
        
        // Update the seenLeads set
        parsedLeads.forEach(lead => {
          // Create a unique identifier for each lead
          const leadId = `${lead.title}-${lead.link}`;
          seenLeadsRef.current.add(leadId);
        });
      } catch (e) {
        console.error('Failed to parse saved leads', e);
      }
    }

    const savedSearches = localStorage.getItem('searchHistory');
    if (savedSearches) {
      try {
        setSearchHistory(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Save leads to localStorage whenever they change
  useEffect(() => {
    if (allLeads.length > 0) {
      localStorage.setItem('savedLeads', JSON.stringify(allLeads));
    }
  }, [allLeads]);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const fetchCredits = async (token: string) => {
    if (!token) return;
    try {
      const response = await axios.post('https://api.leadtech.solutions/api/users/get-credits', { userToken: token });
      setCredits(response.data.credits);
      
      // Check if credits are low (less than 100) and show notification
      if (response.data.credits < 100) {
        setNotification({
          message: 'Your credits are running low. Consider upgrading your plan.',
          type: 'info'
        });
      }
    } catch (err) {
      setError('Failed to fetch credits');
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword to search');
      return;
    }
    
    if (!userToken) {
      setError('User token not found. Please log in again.');
      return;
    }

    // Check if credits are already known to be too low
    if (credits !== null && credits < 50) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<ScrapeResponse>('https://api.leadtech.solutions/api/data/scrape', { userToken, keyword });

      if (response.data.error && response.data.error.includes("Not enough credits")) {
        setIsUpgradeModalOpen(true);
      } else {
        // Add unique identifier to each lead
        const newLeads = response.data.data || [];
        
        // Filter out duplicates and add to existing leads
        const uniqueNewLeads = newLeads.filter(lead => {
          const leadId = `${lead.title}-${lead.link}`;
          if (seenLeadsRef.current.has(leadId)) {
            return false;
          } else {
            seenLeadsRef.current.add(leadId);
            return true;
          }
        });

        setAllLeads(prevLeads => [...prevLeads, ...uniqueNewLeads]);
        setCredits(response.data.remainingCredits);
        
        // Add to search history if it's a new keyword
        if (!searchHistory.includes(keyword)) {
          setSearchHistory(prev => [keyword, ...prev.slice(0, 9)]);
        }
        
        // Show success notification
        if (uniqueNewLeads.length > 0) {
          setNotification({
            message: `Added ${uniqueNewLeads.length} new leads`,
            type: 'success'
          });
        } else {
          setNotification({
            message: 'No new leads found',
            type: 'error'
          });
        }
      }
    } catch (err: any) {
      if (err.response?.status === 400 || (err.response?.data?.error && err.response?.data?.error.includes("Not enough credits"))) {
        setIsUpgradeModalOpen(true);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch leads');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(allLeads.length / itemsPerPage)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearAllLeads = () => {
    if (window.confirm('Are you sure you want to clear all leads? This cannot be undone.')) {
      setAllLeads([]);
      seenLeadsRef.current.clear();
      localStorage.removeItem('savedLeads');
      setNotification({
        message: 'All leads have been cleared',
        type: 'info'
      });
    }
  };

  const handleKeywordSelect = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
    setShowSearchHistory(false);
  };

  const handleUpgradeClick = () => {
    setIsUpgradeModalOpen(false);
    // Redirect to user profile section if onSwitchSection is available
    if (onSwitchSection) {
      onSwitchSection('UserSection');
    } else {
      // Fallback to direct navigation if onSwitchSection is not available
      window.location.href = '/user-profile';
    }
  };

  // Convert to PDF
  const downloadPDF = () => {
    if (allLeads.length === 0) {
      setError('No leads to download');
      return;
    }
    
    const doc = new jsPDF();
    doc.text("Lead Generation Data", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [['Business Name', 'Phone', 'Stars', 'Reviews', 'Website']],
      body: allLeads.map(lead => [
        lead.title,
        lead.phone || 'N/A',
        lead.stars.toString(),
        lead.reviews.toString(),
        lead.website ? lead.website : 'N/A'
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 30 }, 4: { cellWidth: 50 } }
    });

    doc.save('leads.pdf');
    
    setNotification({
      message: 'PDF downloaded successfully',
      type: 'success'
    });
  };

  // Convert to Excel
  const downloadExcel = () => {
    if (allLeads.length === 0) {
      setError('No leads to download');
      return;
    }
    
    const ws = XLSX.utils.json_to_sheet(allLeads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, 'leads.xlsx');
    
    setNotification({
      message: 'Excel file downloaded successfully',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-6xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 animate-fadeIn">
          <span className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">{error}</span>
          </span>
          <button 
            className="absolute top-0 right-0 p-2" 
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 max-w-xs sm:max-w-sm px-4 py-3 rounded-lg shadow-lg border animate-fadeIn
            ${notification.type === 'success' 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : notification.type === 'error'
                ? 'bg-red-100 border-red-400 text-red-700'
                : 'bg-blue-100 border-blue-400 text-blue-700'
            }`}
        >
          <span className="block text-sm sm:text-base">{notification.message}</span>
          <button 
            className="absolute top-1 right-1 p-1" 
            onClick={() => setNotification(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Credit Info Banner */}
      {credits !== null && credits < 100 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm sm:text-base">Your credits are running low ({credits} remaining) Go to User Profile Section And rechage your Wallet</span>
            <span className="text-sm sm:text-base"></span>
          </div>
          {/* <button 
            onClick={handleUpgradeClick}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Upgrade
          </button> */}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-100">
        <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3">Find Business Leads</h2>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
              placeholder="e.g. Lawyers in New York"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
            
            {/* Search History Dropdown */}
            {showSearchHistory && searchHistory.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                  <button 
                    onClick={() => setShowSearchHistory(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {searchHistory.map((term, index) => (
                  <div 
                    key={index}
                    onClick={() => handleKeywordSelect(term)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none"
                  >
                    <div className="flex items-center">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{term}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSearch}
              disabled={loading || !userToken || !keyword.trim()}
              className="w-full sm:flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 text-base sm:text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Generate Leads
                </>
              )}
            </button>
            
            {credits !== null && (
              <div className="w-full sm:w-auto bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-center gap-2 shadow-sm">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 font-medium">{credits} Credits</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Info */}
      {allLeads.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 font-medium">Total Leads: {allLeads.length}</span>
            <span className="text-sm text-gray-500">Page {page} of {Math.ceil(allLeads.length / itemsPerPage)}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearAllLeads}
              className="flex items-center gap-1 px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
            
            {allLeads.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={downloadExcel} 
                  className="flex items-center gap-1 px-3 py-1.5 border border-green-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" /> Excel
                </button>
                <button 
                  onClick={downloadPDF} 
                  className="flex items-center gap-1 px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leads List */}
      {allLeads.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {allLeads.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((lead, index) => (
              <div 
                key={`${lead.title}-${lead.link}-${index}`} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-2">{lead.title}</h3>
                
                <div className="flex items-center text-amber-500 mb-2">
                  <span>⭐ {lead.stars}</span>
                  <span className="text-gray-600 text-sm ml-2">({lead.reviews} reviews)</span>
                </div>
                
                {lead.phone ? (
                  <div className="flex items-center gap-2 text-green-600 mb-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <a href={`tel:${lead.phone}`} className="hover:underline text-sm sm:text-base truncate">{lead.phone}</a>
                  </div>
                ) : (
                  <div className="text-gray-400 mb-3 text-sm">No phone available</div>
                )}
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <a 
                    href={lead.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>View Location</span>
                  </a>
                  
                  {lead.website && (
                    <a 
                      href={lead.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {allLeads.length > itemsPerPage && (
            <div className="flex justify-center mt-6 gap-2">
              {/* <button 
                onClick={() => handlePageChange(1)} 
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                disabled={page === 1}
              >
                <ChevronLeft className="w-3 h-3" />
                <ChevronLeft className="w-3 h-3 -ml-1" />
              </button> */}
              
              <button 
                onClick={() => handlePageChange(page - 1)} 
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center px-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <span className="text-sm sm:text-base font-medium">{page} / {Math.ceil(allLeads.length / itemsPerPage)}</span>
              </div>
              
              <button 
                onClick={() => handlePageChange(page + 1)} 
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                disabled={page === Math.ceil(allLeads.length / itemsPerPage)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              
              {/* <button 
                onClick={() => handlePageChange(Math.ceil(allLeads.length / itemsPerPage))} 
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                disabled={page === Math.ceil(allLeads.length / itemsPerPage)}
              > */}
                {/* <ChevronRight className="w-3 h-3" /> */}
                {/* <ChevronRight className="w-3 h-3 -ml-1" /> */}
              {/* </button> */}
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-3">
              <Search className="w-10 h-10 text-gray-300 mx-auto" />
            </div>
            <p className="text-lg">No leads found</p>
            <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
          </div>
        )
      )}

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-5 max-w-md w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upgrade Your Plan</h2>
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-lg mb-4">
                <p className="text-sm">
                  You don't have enough credits to perform this search. Minimum 50 credits required.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Benefits of Upgrading:</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Access to unlimited lead searches</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Export leads in multiple formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
              <button 
                onClick={handleUpgradeClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700">Searching for leads...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenerator;