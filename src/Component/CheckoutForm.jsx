import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Typography,
  Modal,
  Button,
  Form,
  Row,
  Col,
  Radio,
} from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const CheckoutForm = ({
  customerName,
  setCustomerName,
  customerNumber,
  setCustomerNumber,
  selectedAddress,
  setSelectedAddress,
  orderNote,
  setOrderNote,
  paymentMethod,
  setPaymentMethod,
  locations,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    const savedFee = localStorage.getItem("deliveryFee");

    if (savedAddress) setSelectedAddress(savedAddress);
    if (savedFee) setDeliveryFee(Number(savedFee));
  }, [setSelectedAddress]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedTown(null);
    setDeliveryFee(null);
  };

  const handleTownChange = (townName) => {
    const regionData = locations.find((loc) => loc.region === selectedRegion);
    const townData = regionData?.towns.find((town) => town.name === townName);
    if (townData) {
      setSelectedTown(townName);
      setDeliveryFee(townData.delivery_fee);
    }
  };

  const handleSaveLocation = () => {
    if (selectedRegion && selectedTown && deliveryFee !== null) {
      const fullAddress = `${selectedTown} (${selectedRegion})`;
      setSelectedAddress(fullAddress);
      localStorage.setItem("selectedAddress", fullAddress);
      localStorage.setItem("deliveryFee", deliveryFee.toString());
      setIsModalOpen(false);
    }
  };

  return (
    <Form layout="vertical" className="space-y-4">
      <Title level={4}>Checkout Details</Title>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item label="Customer Name" required>
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item label="Contact Number" required>
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Delivery Address">
        <div className="flex justify-between items-center gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="text-sm text-gray-700 flex-1">
            {selectedAddress ? (
              <>
                <EnvironmentOutlined className="mr-1 text-green-500" />
                {selectedAddress}
              </>
            ) : (
              "No address selected"
            )}
            {deliveryFee !== null && (
              <div className="text-green-600 mt-1 text-xs">
                Delivery Fee:{" "}
                <strong>
                  {deliveryFee === 0 ? "N/A" : `₵${deliveryFee}`}
                </strong>
              </div>
            )}
          </div>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Select Location
          </Button>
        </div>
      </Form.Item>

      <Modal
        title="Select Delivery Location"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveLocation}
        okText="Save"
        destroyOnClose
      >
        <div className="space-y-4">
          <Form layout="vertical">
            <Form.Item label="Select Region">
              <Select
                value={selectedRegion}
                onChange={handleRegionChange}
                placeholder="Choose region"
              >
                {locations.map((location) => (
                  <Option key={location.region} value={location.region}>
                    {location.region}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedRegion && (
              <Form.Item label="Select Town">
                <Select
                  value={selectedTown}
                  onChange={handleTownChange}
                  placeholder="Choose town"
                >
                  {locations
                    .find((loc) => loc.region === selectedRegion)
                    ?.towns.map((town) => (
                      <Option key={town.name} value={town.name}>
                        {town.name} (
                        {town.delivery_fee === 0
                          ? "N/A"
                          : `₵${town.delivery_fee}`}
                        )
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>

      <Form.Item label="Order Note">
        <TextArea
          prefix={<FileTextOutlined />}
          rows={3}
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="Add any notes about your order"
        />
      </Form.Item>

      <Form.Item label="Payment Method" required>
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          {/* Conditionally render based on delivery fee */}
          {deliveryFee !== 0 && (
            <Radio value="Cash on Delivery">Cash on Delivery</Radio>
          )}
          <Radio value="Mobile Money">Mobile Money</Radio>
          <Radio value="Credit Card">Credit Card</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default CheckoutForm;
