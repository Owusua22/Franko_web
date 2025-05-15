import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkOutOrder,
  updateOrderDelivery,
  saveCheckoutDetails,
  saveAddressDetails,
} from "../Redux/Slice/orderSlice";
import { clearCart } from "../Redux/Slice/cartSlice";
import {
  message,
  Button,
  Input,
  Select,
  Card,
  Typography,
  Divider,
  Space,
} from "antd";
import CheckoutForm from "../Component/CheckoutForm";
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.orders);

  const cartId = localStorage.getItem("cartId");
  const customerData = JSON.parse(localStorage.getItem("customer"));
  const selectedCart = JSON.parse(localStorage.getItem("selectedCart"));
  const cartItems =
    selectedCart?.length > 0
      ? selectedCart
      : JSON.parse(localStorage.getItem("cart")) || [];

  const customerId = customerData?.customerAccountNumber;
  const customerAccountType = customerData?.accountType;
  const customerName = `${customerData?.firstName || ""} ${customerData?.lastName || ""}`;
  const customerNumber = customerData?.contactNumber || customerData?.ContactNumber || "";

  const storedShipping = JSON.parse(localStorage.getItem("shippingDetails")) || {};
  const defaultAddress = storedShipping?.location || "";
  const shippingFee = storedShipping?.locationCharge || 0;

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderNote, setOrderNote] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(defaultAddress);

  const addressOptions = [defaultAddress, "Warehouse Pickup", "Branch Office Delivery"];

  const calculateTotalAmount = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.total || 0), 0);
    return subtotal + shippingFee;
  };

  const generateOrderId = () => {
    const prefix = "ORD";
    const timestamp = new Date().getTime() % 10000;
    const randomNum = Math.floor(Math.random() * 1000);
    return `${prefix}-${timestamp}-${randomNum}`;
  };

  const storeCheckoutDetailsInLocalStorage = (checkoutDetails, addressDetails) => {
    localStorage.setItem("checkoutDetails", JSON.stringify(checkoutDetails));
    localStorage.setItem("orderAddressDetails", JSON.stringify(addressDetails));
  };

  const initiatePayment = async (totalAmount, cartItems, orderId) => {
    const username = "RMWBWl0";
    const password = "3c42a596cd044fed81b492e74da4ae30";
    const encodedCredentials = btoa(`${username}:${password}`);

    const payload = {
      totalAmount,
      description: `Payment for ${cartItems.map((item) => item.productName).join(", ")}`,
      callbackUrl: "https://eon1b314mokendl.m.pipedream.net/",
      returnUrl: `https://frankotrading.com/order-success/${orderId}`,
      merchantAccountNumber: "2020892",
      cancellationUrl: "https://frankotrading.com/order-cancelled",
      clientReference: orderId,
    };

    try {
      const response = await fetch("https://payproxyapi.hubtel.com/items/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.status === "Success") return result.data.checkoutUrl;
      throw new Error(result.message || "Payment initiation failed.");
    } catch {
      throw new Error("Payment initiation failed. Please try again.");
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) return message.warning("Please select a payment method.");
    if (!selectedAddress) return message.warning("Please select an address.");

    const orderId = generateOrderId();
    const orderDate = new Date().toISOString();
    const totalAmount = calculateTotalAmount();

    const checkoutDetails = {
      Cartid: cartId,
      customerId,
      orderCode: orderId,
      PaymentMode: paymentMethod,
      PaymentAccountNumber: customerNumber,
      customerAccountType,
      paymentService: "Mtn",
      totalAmount,
      recipientName: customerName,
      recipientContactNumber: customerNumber,
      orderNote: orderNote || "N/A",
      orderDate,
    };

    const addressDetails = {
      orderCode: orderId,
      address: selectedAddress,
      Customerid: customerId,
      recipientName: customerName,
      recipientContactNumber: customerNumber,
      orderNote: orderNote || "N/A",
      geoLocation: "N/A",
    };

    try {
      if (["Mobile Money", "Credit Card"].includes(paymentMethod)) {
        storeCheckoutDetailsInLocalStorage(checkoutDetails, addressDetails);
        dispatch(saveCheckoutDetails(checkoutDetails));
        dispatch(saveAddressDetails(addressDetails));
        const paymentUrl = await initiatePayment(totalAmount, cartItems, orderId);
        if (paymentUrl) window.location.href = paymentUrl;
      } else {
        await dispatch(checkOutOrder({ cartId, ...checkoutDetails })).unwrap();
        await dispatch(updateOrderDelivery(addressDetails)).unwrap();
        dispatch(clearCart());
        localStorage.removeItem("cart");
        localStorage.removeItem("cartId");
        localStorage.removeItem("selectedCart");
        message.success("Order placed successfully!");
        navigate("/order-received");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred during checkout.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card title="Checkout" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <CheckoutForm
  customerName={customerName}
  customerNumber={customerNumber}
  setCustomerNumber={(num) => localStorage.setItem("customer", JSON.stringify({ ...customerData, contactNumber: num }))}
  selectedAddress={selectedAddress}
  setSelectedAddress={setSelectedAddress}
  addressOptions={addressOptions}
  orderNote={orderNote}
  setOrderNote={setOrderNote}
  paymentMethod={paymentMethod}
  setPaymentMethod={setPaymentMethod}
/>
<Divider />


          <Divider />

          <Text strong>Cart Summary:</Text>
          {(selectedCart?.length > 0 ? selectedCart : cartItems).map((item) => (
            <div key={item.productId} className="flex justify-between">
              <Text>{item.productName} (x{item.quantity})</Text>
              <Text>GHS {item.total?.toFixed(2)}</Text>
            </div>
          ))}

          <Divider />

          <div className="flex justify-between">
            <Text>Shipping Fee:</Text>
            <Text>GHS {shippingFee.toFixed(2)}</Text>
          </div>

          <div className="flex justify-between">
            <Title level={4}>Total:</Title>
            <Title level={4}>GHS {calculateTotalAmount().toFixed(2)}</Title>
          </div>

          <Button
            type="primary"
            size="large"
            block
            onClick={handleCheckout}
            loading={loading}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Checkout;
