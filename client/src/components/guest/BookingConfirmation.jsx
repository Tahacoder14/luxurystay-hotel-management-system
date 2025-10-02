import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/api';
import { format, differenceInCalendarDays } from 'date-fns';
import { useReactToPrint,} from 'react-to-print';
import { motion } from 'framer-motion';
import { FaPrint, FaCheckCircle } from 'react-icons/fa';

const BACKEND_URL = 'https://luxurystay-hotel-management-system.vercel.app/api/bookings';

// --- The Professional, Printable Invoice Component ---
// Defined outside the main component for cleanliness and to ensure the ref works reliably.
// 'forwardRef' is the professional way to pass a ref to a child component.
const Invoice = forwardRef(({ booking }, ref) => {
    if (!booking) return null;
    const imageUrl = `${BACKEND_URL}${booking.room.imageUrl.replace(/\\/g, '/')}`;
    const numberOfNights = differenceInCalendarDays(new Date(booking.checkOutDate), new Date(booking.checkInDate));
    
    return (
        <div ref={ref} className="p-10 text-text-dark font-sans">
            <header className="flex justify-between items-center border-b pb-4 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-primary">LuxuryStay</h1>
                    <p className="text-text-muted">Invoice</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">Booking Confirmed</p>
                    <p className="text-sm text-text-muted">ID: {booking._id}</p>
                    <p className="text-sm text-text-muted">Issued: {format(new Date(), 'MMM dd, yyyy')}</p>
                </div>
            </header>
            <main>
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="font-semibold text-text-muted mb-2">Billed To</h3>
                        <p className="font-bold text-lg">{booking.guestDetails.firstName} {booking.guestDetails.lastName}</p>
                        <p>{booking.guestDetails.email}</p>
                        <p>{booking.guestDetails.phone}</p>
                    </div>
                    <div className="text-right">
                         <h3 className="font-semibold text-text-muted mb-2">Reservation Dates</h3>
                         <p><strong>Check-in:</strong> {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</p>
                         <p><strong>Check-out:</strong> {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</p>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-brand-primary mb-4">Reservation Summary</h2>
                <div className="bg-brand-light p-4 rounded-lg">
                    <table className="w-full">
                        <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-right py-2">Price</th></tr></thead>
                        <tbody>
                            <tr>
                                <td className="py-2">
                                    <p className="font-bold">{booking.room.name}</p>
                                    <p className="text-sm text-text-muted">{numberOfNights} night(s) at ${booking.room.price}/night</p>
                                </td>
                                <td className="text-right">${(booking.room.price * numberOfNights).toLocaleString()}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 font-bold"><td className="py-4 text-right">Total</td><td className="py-4 text-right">${booking.totalPrice.toLocaleString()}</td></tr>
                        </tfoot>
                    </table>
                </div>
            </main>
            <footer className="mt-12 pt-4 border-t text-center text-text-muted text-sm">
                <p>Thank you for choosing LuxuryStay. We look forward to welcoming you.</p>
                <p>123 Luxury Avenue, Elegance City | (123) 456-7890 | reservations@luxurystay.com</p>
            </footer>
        </div>
    );
});


const BookingConfirmation = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await api.get(`https://luxurystay-hotel-management-system.vercel.app/api/bookings/${id}`);
                setBooking(res.data);
            } catch (error) {
                console.error("Failed to fetch booking details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
        documentTitle: `LuxuryStay-Invoice-${booking?._id}`,
    });

    if (isLoading) return <div className="text-center py-20">Loading Your Confirmation...</div>;
    if (!booking) return <div className="text-center py-20 text-red-500">Could not load booking details.</div>;

    return (
        <div className="container mx-auto py-12 md:py-20 text-center">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-brand-primary">Booking Confirmed!</h2>
                <p className="text-text-muted mt-2">Thank you, {booking.guestDetails.firstName}. A confirmation email has been sent.</p>
                <div className="my-8 text-left bg-brand-light p-4 rounded-md">
                    <p><strong>Booking ID:</strong> <span className="font-mono text-sm">{booking._id}</span></p>
                    <p><strong>Room:</strong> {booking.room.name}</p>
                    <p><strong>Check-in:</strong> {format(new Date(booking.checkInDate), 'eeee, MMMM dd, yyyy')}</p>
                    <p><strong>Check-out:</strong> {format(new Date(booking.checkOutDate), 'eeee, MMMM dd, yyyy')}</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <button onClick={handlePrint} className="...">
                     <FaPrint /> Print Invoice
                      </button>

                    <Link to="/" className="py-3 px-6 rounded-md text-gray-600 hover:bg-gray-100 border">Back to Home</Link>
                </div>
                {/* Hidden component that is used ONLY for printing */}
                <div className="hidden">
                    <Invoice booking={booking} ref={invoiceRef} />
                </div>
            </motion.div>
        </div>
    );
};
export default BookingConfirmation;