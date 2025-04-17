import React, { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import SalespersonDetailsModal from "./SalespersonDetailsModal";

interface Salesperson {
  _id: string;
  name: string;
  designation: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

interface SalespersonCardProps {
  salesperson: Salesperson;
}

const SalespersonCard: React.FC<SalespersonCardProps> = ({ salesperson }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("This is salesperson ---->>>>>", salesperson);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <h4 className="text-lg font-semibold mb-2">{salesperson.name}</h4>
        <p className="text-blue-600 mb-4">Salesperson</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} />
            <span>{salesperson.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={16} />
            <span>{salesperson.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="truncate">{salesperson.address}</span>
          </div>
        </div>
      </div>

      <SalespersonDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        salesperson={salesperson}
      />
    </>
  );
};

export default SalespersonCard;
