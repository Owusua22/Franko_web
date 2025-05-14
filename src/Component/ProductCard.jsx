import {
  EyeIcon,
  ShoppingCartIcon,
  HeartIcon as OutlineHeartIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@material-tailwind/react";

// Price formatter
const formatPrice = (amount) =>
  amount?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Image URL handler
const getValidImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";
  return imagePath.includes("\\")
    ? `https://smfteapi.salesmate.app/Media/Products_Images/${imagePath.split("\\").pop()}`
    : imagePath;
};

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-md p-4 space-y-4">
    <div className="h-40 bg-gray-200 rounded-xl"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
  </div>
);

const ProductCard = ({ currentProducts, navigate, loading = false }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        : currentProducts.map((product, index) => {
            const imageUrl = getValidImageUrl(product.productImage);
            const discount =
              product.oldPrice > 0
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0;

            return (
              <div
                key={product.productID || index}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full z-10 w-10 h-10 flex items-center justify-center">
                      -{discount}%
                    </span>
                  )}

                  {/* Product Image */}
                  <div
                    className="h-40 md:h-52 w-full flex items-center justify-center cursor-pointer transition-transform duration-300"
                    onClick={() => navigate(`/product/${product.productID}`)}
                  >
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Hover Icons */}
                  <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-3 bg-black/40 z-20 transition-all">
                    <Tooltip content="Add to Wishlist" placement="top">
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <OutlineHeartIcon className="w-5 h-5 text-white hover:text-red-400" />
                      </button>
                    </Tooltip>
                    <Tooltip content="View Details" placement="top">
                      <button
                        onClick={() => navigate(`/product/${product.productID}`)}
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

                {/* Product Info */}
                <div className="p-3 text-center space-y-1">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product.productName || "Franko Trading"}
                  </h3>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-red-500 font-semibold text-sm">
                      GH₵{formatPrice(product.price)}
                    </span>
                    {product.oldPrice > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        GH₵{formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ProductCard;
