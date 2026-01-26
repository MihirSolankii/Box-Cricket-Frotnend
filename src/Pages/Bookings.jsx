const { Currency } = require("lucide-react");

try {
  setIsProcessing(true);

  const token = localStorage.getItem("UserCricBoxToken");
  const userId = localStorage.getItem("UserId");

  const { startTime, endTime } = parseSlot(slot);

  //  CREATE TEMP BOOKING (LOCK SLOT)
  const tempBookingResponse = await fetch(
    'https://box-cricket-backend-v7vh.onrender.com/api/booking/create-temporary',
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

  const tempBookingId = tempBookingData.booking._id;

  //  CREATE PAYMENT ORDER
  const orderResponse = await fetch(
    'https://box-cricket-backend-v7vh.onrender.com/api/booking/create-order',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tempBookingId }),
    }
  );

  const orderData = await orderResponse.json();

  if (!orderResponse.ok) {
    throw new Error(orderData.message || 'Failed to create payment order');
  }

  console.log("order response:", orderData);



} catch (error) {
  console.error("Booking error:", error.message);
  alert(error.message);
} finally {
  setIsProcessing(false);
}





try {

  const token = localStorage.getItem("UserCricBoxToken");
  const userId = localStorage.getItem("UserId")
  console.log("token at booking", token);
  console.log("useri at booking", userId);
  const { startTime, endTime } = parseSlot(slot);
  // console.log("starttime",startTime);
  // console.log("endtime",endTime);

  const datas = {
    boxId: turf._id,
    turfId: courtId,
    date: formatDate(date),
    startTime: startTime,
    endTime: endTime,
    userId
  };
  // console.log("payload",datas);


  const tempBookingResponse = await fetch('https://box-cricket-backend-v7vh.onrender.com/api/booking/create-temporary', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',

    },
    body: JSON.stringify({
      boxId: turf._id,
      courtId: courtId,
      date: formatDate(date),
      startTime: startTime,
      endTime: endTime,
      userId: userId
    }),
  });

  if (!tempBookingResponse.ok) {
    const errorData = await tempBookingResponse.json();
    throw new Error(errorData.message || 'Failed to lock slot');
  }

  const response = await tempBookingResponse.json();
  console.log("booking resposne", response);
  setIsProcessing(false);

  const tempBookingId = response.booking._id;
  console.log("booking id for the next input ", tempBookingId);
  orderResponse();


  const orderResponse = async () => {
    const orderResponse = await fetch('https://box-cricket-backend-v7vh.onrender.com/api/booking/create-order', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({
        tempBookingId: tempBookingId,
      }),
    });

    console.log("orders are ::::", await orderResponse.json());

    if (!orderResponse.ok) {
      throw new Error('Failed to create payment order');
    }

    const responses = await orderResponse.json();
    console.log("now order resposne is there", responses);

  }

  const amount = responses.order.amount;
  const currency = responses.order.currency
  const orderId = response.order.id






}
catch (e) {

}
