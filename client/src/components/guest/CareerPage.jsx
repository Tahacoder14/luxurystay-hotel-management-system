import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import ApplicationModal from './ApplicationModal'; // The modal for applying
import { FaBuilding, FaClock } from 'react-icons/fa';

const CareerPage = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null); // This state controls the application modal

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/jobs');
                setJobs(res.data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    return (
        <>
            {/* The Application Modal is rendered here, but only becomes visible when a job is selected */}
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
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary">Join Our Team</h1>
                        <p className="text-text-muted mt-4 max-w-2xl mx-auto">
                            We are always looking for passionate and talented individuals to be part of the LuxuryStay family. Explore our open positions below.
                        </p>
                    </motion.div>
                    
                    {isLoading ? (
                        <div className="text-center text-text-muted">Loading career opportunities...</div>
                    ) : jobs.length > 0 ? (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {jobs.map((job, index) => (
                                <motion.div 
                                    key={job._id} 
                                    initial={{ opacity: 0, y: 50 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center"
                                >
                                    <div className="mb-4 md:mb-0">
                                        <h2 className="text-2xl font-bold text-brand-primary">{job.title}</h2>
                                        <div className="flex items-center gap-4 text-text-muted mt-2 text-sm">
                                            <span className="flex items-center gap-2"><FaBuilding /> {job.location}</span>
                                            <span className="flex items-center gap-2"><FaClock /> {job.type}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedJob(job)} 
                                        className="bg-brand-accent text-white font-bold py-2 px-6 rounded-md hover:bg-teal-500 transition-colors transform hover:scale-105"
                                    >
                                        Apply Now
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                            <h3 className="text-2xl font-bold text-brand-primary">No Open Positions</h3>
                            <p className="text-text-muted mt-2">There are currently no open positions, but we are always looking for great talent. Please check back later!</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CareerPage;