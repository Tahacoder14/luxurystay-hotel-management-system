import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import ApplicationModal from './ApplicationModal';
import { FaBuilding, FaClock, FaArrowRight } from 'react-icons/fa';

// --- A Professional Skeleton Loader Component for a superb UX ---
const JobCardSkeleton = () => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-32 ml-auto"></div>
    </div>
);

const CareerPage = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            // Optionally, you can set an error state here to show a persistent error message
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    // Function to truncate the description for the card view
    const truncate = (str, num) => {
        return str.length > num ? str.slice(0, num) + "..." : str;
    };

    return (
        <>
            <AnimatePresence>
                {selectedJob && <ApplicationModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
            </AnimatePresence>
            <div className="bg-brand-light py-16 md:py-20 min-h-screen">
                <div className="container mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12 md:mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary">Find Your Calling</h1>
                        <div className="w-24 h-1 bg-brand-accent mx-auto mt-4"></div>
                        <p className="text-text-muted mt-6 max-w-2xl mx-auto">
                            Join a team that values excellence and passion. Explore our open positions at LuxuryStay.
                        </p>
                    </motion.div>
                    
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {isLoading ? (
                            // --- Professional Skeleton Loading UI ---
                            <>
                                <JobCardSkeleton />
                                <JobCardSkeleton />
                            </>
                        ) : jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <motion.div 
                                    key={job._id} 
                                    initial={{ opacity: 0, y: 50 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl flex flex-col md:flex-row justify-between items-start"
                                >
                                    <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                                        <h2 className="text-2xl font-bold text-brand-primary">{job.title}</h2>
                                        <div className="flex items-center gap-4 text-text-muted mt-2 text-sm">
                                            <span className="flex items-center gap-2"><FaBuilding /> {job.location}</span>
                                            <span className="flex items-center gap-2"><FaClock /> {job.type}</span>
                                        </div>
                                        <p className="text-text-secondary mt-3 text-sm">{truncate(job.description, 150)}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedJob(job)} 
                                        className="mt-4 md:mt-0 bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500 transition-colors transform hover:scale-105 flex items-center gap-2 flex-shrink-0"
                                    >
                                        Apply Now <FaArrowRight />
                                    </button>
                                </motion.div>
                            ))
                        ) : (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                                <h3 className="text-2xl font-bold text-brand-primary">No Open Positions</h3>
                                <p className="text-text-muted mt-2">There are currently no open positions, but we are always looking for great talent. Please check back later!</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CareerPage;