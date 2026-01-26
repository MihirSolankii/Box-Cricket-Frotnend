import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MapPin, Clock, Calendar, Check, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import Header from '@/component/Headers';
import Footer from '@/component/Footer';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { routes } from '../../routes';


const parseSlot = (slot) => {
  // Example: "5-6 PM"
  const [timeRange, period] = slot.split(" ");
  let [start, end] = timeRange.split("-");

  const to24Hour = (time, period) => {
    let hour = parseInt(time, 10);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return {
    startTime: to24Hour(start, period),
    endTime: to24Hour(end, period),
  };
};


const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};








const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { turf, courtId, court, date, slot } = location.state || {};
  // console.log("turf",turf);

  //   console.log("turf id",turf._id);
  //   console.log("date",date);
  //   console.log("slot",slot); 

  //   console.log("Court ID:", courtId);
  // console.log("Court:", court); 



  const [duration, setDuration] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle Missing Data
  if (!turf || !courtId || !court) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-card border border-border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Incomplete Booking Data
            </h1>
            <p className="text-muted-foreground mb-6">
              Please select a court and slot to proceed.
            </p>
            <Button onClick={() => navigate('/turfs')} size="lg">
              Browse Turfs
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  const totalPrice = turf.pricePerHour * duration;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!name || !phone || !email) {
      setError('Please fill all required fields');
      return;
    }

    setIsProcessing(true);


    try {
      setIsProcessing(true);

      const token = localStorage.getItem("UserCricBoxToken");
      const userId = localStorage.getItem("UserId");
      console.log(userId);


      const { startTime, endTime } = parseSlot(slot);

      const tempBookingResponse = await fetch(
        `${routes.createTemporary}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boxId: turf._id,
            courtId,
            date: formatDate(date),
            startTime,
            endTime,
            userId,
          }),
        }
      );

      const tempBookingData = await tempBookingResponse.json();

      if (!tempBookingResponse.ok) {
        throw new Error(tempBookingData.message || 'Failed to lock slot');
      }

      console.log("booking response:", tempBookingData);

      const tempBookingId = tempBookingData.booking?._id;
      console.log("hello this is booking ",tempBookingId);
      localStorage.setItem("bookingid", tempBookingId)


      const orderResponse = await fetch(
        `${routes.createPayment}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: tempBookingId }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      console.log("order response:", orderData);

      const amount = orderData.order.amount;
      const currency = orderData.order.currency
      const orderId = orderData.order.id




      // const { orderId, amount, currency, razorpayKeyId } = await orderResponse.json();

      // Step 3: Open Razorpay Checkout
      const options = {
        key: "rzp_test_Rw83ErHFAcrloP", // Your Razorpay Key ID from backend
        amount: amount, // Amount in paise
        currency: "INR",
        name: 'Turf Booking',
        description: `${turf.name} - ${format(new Date(date), 'MMM d, yyyy')}`,
        order_id: orderId,
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#22C35D;', // Your brand color
        },
        method: {
          upi: true,       
           card: true,       
        // netbanking: true, 
          wallet: true,     // optional
        },
        handler: async function (response) {
          // Payment successful - verify on backend
          await confirmPayment(response);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError('Payment cancelled. Your slot lock will expire in 10 minutes.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error('Booking error:', err);
      console.log(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }

    finally {
      setIsProcessing(false)
    }
  };


  const confirmPayment = async (response) => {

    console.log("---------------------------------------------------inside verifypayemnt---------------------");
    const token = localStorage.getItem("UserCricBoxToken");

    console.log("hello payment", response.razorpay_payment_id);
    const tempid = localStorage.getItem("bookingid")
    console.log("hello................", tempid);


    try {
      const res = await fetch(
        `${routes.verifyPayment}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // if auth
          },



          body: JSON.stringify({
            bookingId: tempid,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Booking confirmed 🎉");
        navigate("/create-group");
      } else {
        alert(data.message);
        console.log(data);

      }
    } catch (err) {
      console.error(err);
      console.log("error")
      alert("Payment verification failed");
    }
  };

  // const verifyPayment = async (paymentResponse, tempBookingId) => {
  //   try {
  //     // The webhook will handle verification and confirmation
  //     // But we can also verify on client side for immediate feedback
  //     const verifyResponse = await fetch('/api/booking/verify-payment', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         razorpay_order_id: paymentResponse.razorpay_order_id,
  //         razorpay_payment_id: paymentResponse.razorpay_payment_id,
  //         razorpay_signature: paymentResponse.razorpay_signature,
  //         tempBookingId: tempBookingId,
  //       }),
  //     });

  //     if (verifyResponse.ok) {
  //       setIsProcessing(false);
  //       setShowSuccess(true);
  //     } else {
  //       throw new Error('Payment verification failed');
  //     }
  //   } catch (err) {
  //     console.error('Verification error:', err);
  //     setIsProcessing(false);
  //     setError('Payment received but verification failed. Please contact support.');
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <main className="flex-1 py-10 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors font-medium"
            disabled={isProcessing}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Details
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-8 tracking-tight">Checkout</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-border shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div onSubmit={handleConfirmBooking} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                          disabled={isProcessing}
                          className="h-11 bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-semibold">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          disabled={isProcessing}
                          className="h-11 bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        disabled={isProcessing}
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                  <CardTitle className="text-xl">Booking Duration</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-input rounded-md bg-background">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-4 h-10 rounded-r-none border-r hover:bg-muted"
                        onClick={() => setDuration(Math.max(1, duration - 1))}
                        disabled={isProcessing}
                      >
                        -
                      </Button>
                      <div className="w-12 text-center font-bold text-lg">{duration}</div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-4 h-10 rounded-l-none border-l hover:bg-muted"
                        onClick={() => setDuration(Math.min(4, duration + 1))}
                        disabled={isProcessing}
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      Hours (Max 4)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="lg:col-span-1">
              <Card className="border border-border shadow-md sticky top-24">
                <CardHeader className="bg-slate-900 text-white rounded-t-lg pb-6">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Order Summary
                  </CardTitle>
                </CardHeader>




                <CardContent className="space-y-6 pt-6">
                  <div className="flex gap-4">
                    <div>
                      <h3 className="font-bold text-foreground leading-tight">{turf.name}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{turf.address?.fullAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">Court</span>
                    <span className="font-medium text-foreground">
                      {court.courtName}
                    </span>
                  </div>




                  <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-border/50 pb-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Date
                      </span>
                      <span className="font-medium text-foreground">
                        {format(new Date(date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border/50 pb-2">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Start Time
                      </span>
                      <span className="font-medium text-foreground">{slot}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{duration} hr{duration > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span>₹{turf.pricePerHour} / hr</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span>₹0</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-border">
                    <span className="font-bold text-lg">Total Payable</span>
                    <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/30 pt-6">
                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full h-12 text-base font-semibold shadow-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm & Pay'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* SUCCESS MODAL */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md text-center p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              You are all set for <strong>{turf.name}</strong> on <br />
              {format(new Date(date), 'MMMM d')} at {slot}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6 w-full">
            <Button onClick={() => navigate('/my-bookings')} className="w-full h-11">
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full h-11 border-border">
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Booking;