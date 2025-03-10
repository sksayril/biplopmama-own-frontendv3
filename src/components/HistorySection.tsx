import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, ChevronLeft, ChevronRight, Search, AlertCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

export default function HistorySection() {
  const [history, setHistory] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchScrapedData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
          setError("Authentication required. Please log in again.");
          setIsLoading(false);
          return;
        }

        const response = await axios.post("https://api.leadtech.solutions/api/data/get-scraped-data", {
          userToken,
        });

        setHistory(response.data.data);

        // Set default selected keyword (first available)
        if (response.data.data.length > 0) {
          setSelectedKeyword(response.data.data[0].keyword);
          setFilteredData(response.data.data[0].data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load your data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScrapedData();
  }, []);

  // Handle keyword selection
  const handleKeywordChange = (event) => {
    const keyword = event.target.value;
    setSelectedKeyword(keyword);
    const selectedItem = history.find((item) => item.keyword === keyword);
    setFilteredData(selectedItem ? selectedItem.data : []);
    setCurrentPage(1); // Reset to first page on selection change
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (filteredData.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeadsData");
    XLSX.writeFile(workbook, `${selectedKeyword}.xlsx`);
  };

  // Export to PDF with proper formatting
  const exportToPDF = async () => {
    if (filteredData.length === 0) return;
    
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.text("Leads Data", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [["Title", "Phone", "Stars", "Reviews", "Website"]],
      body: filteredData.map((lead) => [
        lead.title || "N/A",
        lead.phone || "N/A",
        lead.stars !== undefined ? lead.stars.toString() : "N/A",
        lead.reviews !== undefined ? lead.reviews.toString() : "N/A",
        lead.website || "N/A",
      ]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [0, 102, 204] },
      columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 30 }, 4: { cellWidth: 50 } },
    });

    doc.save(`${selectedKeyword}.pdf`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-700">Loading your leads data...</h3>
        <p className="text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-700">Oops! Something went wrong</h3>
        <p className="text-red-500 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty History State
  if (history.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Leads Data History</h2>
        <div className="bg-blue-50 rounded-lg p-8 flex flex-col items-center text-center border border-blue-200">
          <Search className="h-16 w-16 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-blue-700">No search history found</h3>
          <p className="text-blue-600 mt-2 mb-6 max-w-md">
            You haven't searched for any leads yet. Try searching for a keyword to collect leads data.
          </p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium">
            Start New Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Leads Data History</h2>

      {/* Dropdown to Select Keyword */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Select Keyword:</label>
        <select
          value={selectedKeyword}
          onChange={handleKeywordChange}
          className="w-full p-2 border rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        >
          {history.map((item) => (
            <option key={item._id} value={item.keyword}>
              {item.keyword}
            </option>
          ))}
        </select>
      </div>

      {/* Download Buttons */}
      <div className="flex justify-between mb-4">
        <button 
          onClick={exportToExcel} 
          disabled={filteredData.length === 0}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} className="inline mr-2" />
          Download Excel
        </button>
        <button 
          onClick={exportToPDF} 
          disabled={filteredData.length === 0}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} className="inline mr-2" />
          Download PDF
        </button>
      </div>

      {/* No Data for Selected Keyword */}
      {filteredData.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-yellow-700">No leads available</h3>
          <p className="text-yellow-600 mt-2 max-w-md mx-auto">
            We couldn't find any leads data for "{selectedKeyword}". Try selecting a different keyword or start a new search.
          </p>
        </div>
      ) : (
        <>
          {/* Cards View */}
          {currentItems.map((lead, i) => (
            <div key={i} className="bg-white p-4 rounded-lg mb-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800">{lead.title || "Unnamed Business"}</h3>
              <div className="mt-2 space-y-2">
                <a 
                  href={lead.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:text-blue-700 hover:underline flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm-1.45 18.996h1.5v-1.5h-1.5v1.5zm2.4-6.75q-.3.45-.599.899-.3.45-.601.601-.3.15-.75.15v1.5q1.05 0 1.8-.675.75-.674 1.35-1.725l-1.2-.75zm-2.4-5.996q-1.8 0-3.15 1.275Q5.75 8.8 5.75 10.75h1.5q0-1.5 1.125-2.4Q9.5 7.45 10.85 7.45q1.35 0 2.25.9t.9 2.4q0 .9-.45 1.574-.45.675-1.35 1.426-.9.75-1.275 1.5t-.375 1.95h1.5q0-.9.225-1.499.225-.6 1.125-1.35.9-.75 1.425-1.65.525-.9.525-2.1 0-1.8-1.35-3.075t-3.15-1.275z"></path>
                  </svg>
                  View on Maps
                </a>
                
                <p className="flex items-center text-amber-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                  </svg>
                  {lead.stars || "N/A"} ({lead.reviews || 0} reviews)
                </p>
                
                {lead.phone && (
                  <p className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                    </svg>
                    {lead.phone}
                  </p>
                )}
                
                {lead.website && (
                  <a 
                    href={lead.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-green-600 hover:text-green-800 hover:underline flex items-center mt-1"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path>
                    </svg>
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          {filteredData.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center"
              >
                <ChevronLeft size={16} className="mr-1" />
                
              </button>
              <span className="font-semibold text-gray-700">
                Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
              </span>
              <button 
                onClick={nextPage} 
                disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} 
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors flex items-center"
              >
                
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}