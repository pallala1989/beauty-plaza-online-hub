
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface CustomerSelectionProps {
  selectedCustomer: any;
  onCustomerSelect: (customer: any) => void;
  onCreateNewCustomer: (customerData: any) => void;
}

const CustomerSelection: React.FC<CustomerSelectionProps> = ({
  selectedCustomer,
  onCustomerSelect,
  onCreateNewCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Mock customer data - in real app, this would come from API
  const customers = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "(555) 123-4567" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(555) 987-6543" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "(555) 456-7890" }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleCreateCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customerData = {
        ...newCustomer,
        id: Date.now() // Mock ID
      };
      onCreateNewCustomer(customerData);
      onCustomerSelect(customerData);
      setNewCustomer({ name: "", email: "", phone: "" });
      setShowNewCustomerForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold">Select Customer:</Label>
        <p className="text-sm text-gray-600 mt-1">Choose an existing customer or create a new one</p>
      </div>

      {selectedCustomer && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-2">Selected Customer</h3>
            <div className="space-y-1">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCustomerSelect(null)}
              className="mt-2"
            >
              Change Customer
            </Button>
          </CardContent>
        </Card>
      )}

      {!selectedCustomer && (
        <>
          {/* Search Existing Customers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Find Existing Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search by name, email, or phone</Label>
                  <Input
                    id="search"
                    placeholder="Start typing to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {searchTerm && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => onCustomerSelect(customer)}
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                          <div className="text-sm text-gray-600">{customer.phone}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No customers found</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create New Customer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Create New Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showNewCustomerForm ? (
                <Button onClick={() => setShowNewCustomerForm(true)} className="w-full">
                  Add New Customer
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateCustomer} className="flex-1">
                      Create Customer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewCustomerForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CustomerSelection;
