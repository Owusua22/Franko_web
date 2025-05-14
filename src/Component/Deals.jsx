import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  HeartIcon as OutlineHeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { fetchProductByShowroomAndRecord } from "../Redux/Slice/productSlice";
import { Card, CardBody, Tooltip } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const Deals = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showroomID = "1e93aeb7-bba7-4bd4-b017-ea3267047d46";

  const { productsByShowroom, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductByShowroomAndRecord({ showRoomCode: showroomID, recordNumber: 10 }));
  }, [dispatch]);

// Countdown to next Sunday midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diff = 7 - dayOfWeek;
      const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff, 23, 59, 59);
      const total = endOfWeek - now;

      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateArrows = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
      }
    };

    updateArrows();
    scrollRef.current?.addEventListener("scroll", updateArrows);
    return () => scrollRef.current?.removeEventListener("scroll", updateArrows);
  }, [productsByShowroom]);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [productsByShowroom, isHovered]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price || 0);

  return (
    <div className=" mx-auto px-4 md:px-24 py-4">
<div className="mb-6">
  <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
    {/* Title */}
    <h2 className="text-sm md:text-lg font-bold text-gray-900 relative whitespace-nowrap">
      Deals of the Week
      <span className="absolute -bottom-1 left-0 w-16 h-1 bg-red-400 rounded-full "></span>
    </h2>

    {/* Horizontal Divider */}
    <div className="flex-grow h-px bg-gray-300" />

    {/* Countdown Timer */}
    <div className="bg-red-400  text-white px-2 py-2 rounded-full shadow-lg flex gap-3 font-md text-sm md:text-sm tracking-wide items-center whitespace-nowrap">
      <span>Ends in:</span>
      <div className="flex gap-1">
        <span>{String(timeLeft.days).padStart(2, "0")}d</span>:
        <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
        <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
        <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
      </div>
    </div>
  </div>
</div>



      <div className="relative mt-6">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow p-2 rounded-full"
          >
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4"
        >
          {(loading ? [...Array(10)] : productsByShowroom?.[showroomID])?.map((product, idx) => {
            if (loading) {
              return (
                <Card key={idx} className="min-w-[200px] w-[200px] animate-pulse shadow">
                  <div className="h-40 bg-gray-300" />
                  <CardBody>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                  </CardBody>
                </Card>
              );
            }

            const discount =
              product.oldPrice > 0
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;
            const soldOut = product.stock === 0;

            return (
              <div
                key={product.productID}
                className="min-w-[170px] w-[170px] md:min-w-[220px] md:w-[200px] md:p-4 relative group border shadow-sm rounded-2xl overflow-hidden bg-white transition-transform duration-300 hover:shadow-lg"
              >
                {soldOut ? (
                  <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full z-10">
                    SOLD OUT
                  </span>
                ) : discount > 0 ? (
                  <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 w-10 h-10 flex items-center justify-center">
                    -{discount}%
                  </span>
                ) : null}

                <div className="absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-70 py-2 px-2 hidden group-hover:flex justify-around items-center transition">
                  <Tooltip content="Add to Wishlist">
                    <button>
                      <OutlineHeartIcon className="w-5 h-5 text-white hover:text-red-400" />
                    </button>
                  </Tooltip>
                  <Tooltip content="View Details">
                    <button onClick={() => navigate(`/product/${product.productID}`)}>
                      <EyeIcon className="w-5 h-5 text-white hover:text-yellow-400" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Add to Cart">
                    <button>
                      <ShoppingCartIcon className="w-5 h-5 text-white hover:text-green-400" />
                    </button>
                  </Tooltip>
                </div>

                <div
                  onClick={() => navigate(`/product/${product.productID}`)}
                  className="h-40 flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage.split("\\").pop()}`}
                    alt={product.productName}
                    className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <CardBody className="p-1">
                  <h3 className="text-xs md:tex-sm font-medium text-gray-900 line-clamp-2">{product.productName}</h3>
                  <div className="md:flex items-center">
                    <span className="text-red-500 text-sm">{formatPrice(product.price)}</span>
                    {product.oldPrice > 0 && (
                      <span className="block md:flex ml-2 text-xs text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </CardBody>
              </div>
            );
          })}

          {!loading && (
            <div className="min-w-[150px] w-[200px] flex items-center justify-center">
             <Link
  to={`/showroom/${showroomID}`}
  className="flex items-center gap-1 text-green-500 hover:text-green-600 transition"
>
  <span className="text-sm font-medium">View All</span>
  <ArrowRightIcon className="w-5 h-5" />
</Link>

            </div>
          )}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow p-2 rounded-full"
          >
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Deals
