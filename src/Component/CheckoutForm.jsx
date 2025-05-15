// components/CheckoutForm.js
import React from "react";
import { Input, Select, Typography } from "antd";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const CheckoutForm = ({
  customerName,
  setCustomerName,
  customerNumber,
  setCustomerNumber,
  selectedAddress,
  setSelectedAddress,
  addressOptions,
  orderNote,
  setOrderNote,
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Text strong>Customer Name:</Text>
        <Input
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div>
        <Text strong>Contact:</Text>
        <Input
          placeholder="Enter phone number"
          value={customerNumber}
          onChange={(e) => setCustomerNumber(e.target.value)}
        />
      </div>

      <div>
        <Text strong>Select Address:</Text>
        <Select
          value={selectedAddress}
          onChange={setSelectedAddress}
          style={{ width: "100%" }}
          placeholder="Choose delivery address"
        >
          {addressOptions.map((addr, idx) => (
            <Option key={idx} value={addr}>
              {addr}
            </Option>
          ))}
        </Select>
      </div>

      <div>
        <Text strong>Order Note:</Text>
        <TextArea
          rows={3}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Add any notes about your order"
        />
      </div>

      <div>
        <Text strong>Payment Method:</Text>
        <Select
          value={paymentMethod}
          onChange={setPaymentMethod}
          style={{ width: "100%" }}
        >
          <Option value="Cash on Delivery">Cash on Delivery</Option>
          <Option value="Mobile Money">Mobile Money</Option>
          <Option value="Credit Card">Credit Card</Option>
        </Select>
      </div>
    </div>
  );
};

export default CheckoutForm;
