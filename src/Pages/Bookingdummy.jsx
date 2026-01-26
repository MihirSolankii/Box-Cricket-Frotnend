<main className="flex-1 py-10 px-4 md:px-6">
  <div className="container mx-auto max-w-5xl">

    {/* BACK BUTTON */}
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors font-medium"
    >
      <ChevronLeft className="h-5 w-5 mr-1" />
      Back to Details
    </Button>

    <h1 className="text-3xl font-bold text-foreground mb-8 tracking-tight">Checkout</h1>

    <div className="grid lg:grid-cols-3 gap-8">

      {/* --- LEFT COLUMN: FORM --- */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
            <CardTitle className="text-xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form id="booking-form" onSubmit={handleConfirmBooking} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="h-11 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="h-11 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="h-11 bg-background"
                />
              </div>
            </form>
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
                >
                  -
                </Button>
                <div className="w-12 text-center font-bold text-lg">{duration}</div>
                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 h-10 rounded-l-none border-l hover:bg-muted"
                  onClick={() => setDuration(Math.min(4, duration + 1))}
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

      {/* --- RIGHT COLUMN: SUMMARY --- */}
      <div className="lg:col-span-1">
        <Card className="border border-border shadow-md sticky top-24">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg pb-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Turf Info */}
            <div className="flex gap-4">
              <img
                src={turf.image}
                alt={turf.name}
                className="w-20 h-20 object-cover rounded-md border border-border"
              />
              <div>
                <h3 className="font-bold text-foreground leading-tight">{turf.name}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{turf.location}</span>
                </div>
              </div>
            </div>

            {/* Date/Time Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Date
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

            {/* Pricing Breakdown */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate</span>
                <span>₹{turf.price} / hr</span>
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

            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-border">
              <span className="font-bold text-lg">Total Payable</span>
              <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
            </div>
          </CardContent>

          <CardFooter className="bg-muted/30 pt-6">
            <Button
              type="submit"
              form="booking-form"
              className="w-full h-12 text-base font-semibold shadow-sm"
            >
              Confirm & Pay
            </Button>
          </CardFooter>
        </Card>
      </div>

    </div>
  </div>
</main>