import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GroupDetail = () => {
  const { id } = useParams();

  const group = {
    id,
    name: "Sunday Turf Match",
    admin: "Mihir",
    totalAmount: 2000,
    members: [
      { name: "Mihir", paid: true, share: 500, isAdmin: true },
      { name: "Rahul", paid: false, share: 500 },
      { name: "Amit", paid: false, share: 500 },
      { name: "You", paid: false, share: 500 },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{group.name}</h1>
      <p className="text-muted-foreground mb-4">
        Admin: {group.admin}
      </p>

      <div className="border rounded-xl p-4 mb-6">
        <h2 className="font-semibold mb-2">Members & Split</h2>

        {group.members.map((member, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-2 last:border-none"
          >
            <div>
              <p className="font-medium">
                {member.name} {member.isAdmin && "(Admin)"}
              </p>
              <p className="text-sm text-muted-foreground">
                Share: ₹{member.share}
              </p>
            </div>

            {member.paid ? (
              <span className="text-green-600 font-medium">Paid</span>
            ) : (
              <Button size="sm">Pay ₹{member.share}</Button>
            )}
          </div>
        ))}
      </div>

      <div className="border rounded-xl p-4">
        <h2 className="font-semibold mb-2">Settlement Info</h2>
        <p>Total Amount: ₹{group.totalAmount}</p>
        <p>Split Between: {group.members.length} members</p>
      </div>
    </div>
  );
};

export default GroupDetail;
