import { User, Phone, MapPin, Mail } from "lucide-react";

interface SalespersonCardProps {
  salesperson: {
    _id: string;
    name: string;
    designation: string;
    address: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
  };
}

export default function SalespersonCard({ salesperson }: SalespersonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {salesperson.name}
            </h3>
            <p className="text-sm text-gray-600">{salesperson.designation}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          Joined: {new Date(salesperson.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{salesperson.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{salesperson.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{salesperson.address}</span>
        </div>
      </div>
    </div>
  );
}
