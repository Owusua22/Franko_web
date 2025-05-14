import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  HeartIcon as OutlineHeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { fetchProductByShowroomAndRecord } from "../Redux/Slice/productSlice";
import { fetchHomePageShowrooms } from "../Redux/Slice/showRoomSlice";
import { Card, CardBody, Tooltip } from "@material-tailwind/react";

const BestSellers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [activeShowroom, setActiveShowroom] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { homePageShowrooms } = useSelector((state) => state.showrooms);
  const { productsByShowroom, loading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchHomePageShowrooms());
  }, [dispatch]);

  useEffect(() => {
    if (homePageShowrooms?.length > 0) {
      const firstShowroom = homePageShowrooms[0];
      setActiveShowroom(firstShowroom?.showRoomID);
      dispatch(
        fetchProductByShowroomAndRecord({
          showRoomCode: firstShowroom?.showRoomID,
          recordNumber: 10,
        })
      );
    }
  }, [homePageShowrooms, dispatch]);

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
  }, [productsByShowroom, activeShowroom]);

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
    }, 5000);

    return () => clearInterval(interval);
  }, [productsByShowroom, activeShowroom, isHovered]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleShowroomClick = (showRoomID) => {
    setActiveShowroom(showRoomID);
    dispatch(
      fetchProductByShowroomAndRecord({
        showRoomCode: showRoomID,
        recordNumber: 10,
      })
    );
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(price || 0);

  return (
    <div className="mx-auto px-4 md:px-24 py-4">
      {/* Showroom Tabs */}
      <div className="mb-6">
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          <h2 className="text-sm md:text-lg font-bold text-gray-900 relative whitespace-nowrap">
            Trending Products
            <span className="absolute -bottom-1 left-0 w-16 h-1 bg-red-400 rounded-full" />
          </h2>
          <div className="flex-grow h-px bg-gray-300" />
          <div className="flex flex-wrap gap-4">
            {homePageShowrooms?.map((showroom) => {
              const isActive = activeShowroom === showroom.showRoomID;
              return (
                <button
                  key={showroom.showRoomID}
                  onClick={() => handleShowroomClick(showroom.showRoomID)}
                  className={`transition text-sm px-4 py-1.5 rounded-full font-medium border ${
                    isActive
                      ? "bg-green-400 text-white border-green-600"
                      : "text-gray-500 border-gray-300 hover:text-black hover:border-black"
                  }`}
                >
                  {showroom.showRoomName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Products Row */}
      <div className="relative mt-6">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4"
        >
          {(loading
            ? [...Array(10)]
            : productsByShowroom?.[activeShowroom]
          )?.map((product, idx) => {
            if (loading) {
              return (
                <Card
                  key={idx}
                  className="min-w-[200px] w-[200px] animate-pulse shadow"
                >
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
                ? Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )
                : 0;
            const soldOut = product.stock === 0;

            return (
              <div
                key={product.productID}
                className="group bg-white mb-1 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden min-w-[170px] w-[170px] md:min-w-[220px] md:w-[200px]"
              >
                <div className="relative overflow-hidden">
                  {/* Discount or Sold Out Badge */}
                  {soldOut ? (
                    <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full z-10">
                      SOLD OUT
                    </span>
                  ) : (
                    discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 w-10 h-10 flex items-center justify-center">
                        -{discount}%
                      </span>
                    )
                  )}

                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${product.productID}`)}
                    className="h-40 md:h-52 w-full flex items-center justify-center cursor-pointer transition-transform duration-300"
                  >
                    <img
                      src={`https://smfteapi.salesmate.app/Media/Products_Images/${product.productImage
                        .split("\\")
                        .pop()}`}
                      alt={product.productName}
                      className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-3 bg-black/40 z-20 transition-all">
                    <Tooltip content="Add to Wishlist" placement="top">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <OutlineHeartIcon className="w-5 h-5 text-white hover:text-red-400" />
                      </button>
                    </Tooltip>
                    <Tooltip content="View Details" placement="top">
                      <button
                        onClick={() =>
                          navigate(`/product/${product.productID}`)
                        }
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                      >
                        <EyeIcon className="w-5 h-5 text-white hover:text-yellow-400" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Add to Cart" placement="top">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <ShoppingCartIcon className="w-5 h-5 text-white hover:text-green-400" />
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <CardBody className="p-2">
                  <h3 className="text-xs md:text-sm text-gray-700 line-clamp-2">
                    {product.productName}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="text-red-500 text-sm">
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="ml-2 text-xs text-gray-400 line-through">
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
                to={`/showroom/${activeShowroom}`}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
