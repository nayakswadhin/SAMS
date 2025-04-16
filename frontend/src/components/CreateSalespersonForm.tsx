import React, { useState } from "react";
import {
  User,
  MapPin,
  Mail,
  Lock,
  Phone,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import axios from "axios";

interface SalespersonFormData {
  name: string;
  address: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface CreateSalespersonFormProps {
  onSubmit: (data: SalespersonFormData) => void;
}

const CreateSalespersonForm: React.FC<CreateSalespersonFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SalespersonFormData>({
    name: "",
    address: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/api/register", {
        name: formData.name,
        designation: "SalesUser",
        address: formData.address,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        managerId: user._id,
      })
      .then((res) => {
        console.log(res);
        alert("Sales Person created sucessfully!!");
      })
      .catch((e) => {
        console.log(e);
        alert("Error in creating sales person");
      });
    onSubmit(formData);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-center mb-6 text-blue-600">
        <UserPlus size={32} className="animate-bounce" />
        <h2 className="text-2xl font-bold text-center ml-2">
          Create Salesperson
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
            Name
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm"
              required
              placeholder="Enter full name"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
            Address
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm"
              required
              placeholder="Enter complete address"
              rows={3}
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm"
              required
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm"
              required
              placeholder="Enter secure password"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600 transition-colors">
            Phone Number
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors"
              size={20}
            />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-500 bg-white bg-opacity-80 backdrop-blur-sm"
              required
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 mt-8"
        >
          <CheckCircle size={20} className="animate-pulse" />
          Create Salesperson
        </button>
      </form>
    </div>
  );
};

export default CreateSalespersonForm;
