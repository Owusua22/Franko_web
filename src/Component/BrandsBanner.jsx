import React from "react";
import { Card } from "@material-tailwind/react";

// Importing image assets directly
import Samsung from "../assets/samsung.png";
import infinix from "../assets/infinix.png";
import tecno from "../assets/tec.png";
import Hmd from "../assets/hmd.png";
import itelImg from "../assets/itel.png";
import Huawei from "../assets/huawel.png";

const brands = [
  { name: "Samsung", src: Samsung },
  { name: "Infinix", src: infinix },
  { name: "Tecno", src: tecno },
  { name: "HMD", src: Hmd },
  { name: "Itel", src: itelImg },
  { name: "Huawei", src: Huawei },
];

const BrandsBanner = () => {
  return (
    <section className="py-8 bg-white">
      <div className="mx-auto px-4 md:px-24 py-4">
        {/* Header section */}
        {/* Header section */}
<div className="mb-4">
 {/* Header section */}
<div className="mb-4">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-gray-800 relative inline-block">
      Shop by brand
      {/* Yellow underline under text */}

    </h2>
    
  </div>

  {/* Full gray divider */}
  <div className="w-full h-px bg-gray-300 mt-1 relative">
    {/* Align the yellow line flush with the heading underline */}
    <div className="absolute left-0 top-0 h-px w-24 bg-red-400"></div>
  </div>
</div>

</div>


        {/* Brand cards */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
  {brands.map((brand, index) => (
    <Card
      key={index}
      className="border border-gray-200 shadow-none bg-white p-6 flex items-center justify-center hover:shadow-md transition duration-300"
    >
      <img
        src={brand.src}
        alt={brand.name}
        className="max-h-12 object-contain"
      />
    </Card>
  ))}
</div>

      </div>
    </section>
  );
};

export default BrandsBanner;
