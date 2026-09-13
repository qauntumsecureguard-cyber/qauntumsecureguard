"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

function CryptoImage({ src, alt, networkSrc, network }: { src: string, alt: string, networkSrc: string | null, network: string | null }) {
  const pathname = usePathname();
  const isCoinDetailsPage = pathname.startsWith("/crypto/details");

  return (
    <div className="relative inline-block" style={{ width: isCoinDetailsPage ? 80 : 40, height: isCoinDetailsPage ? 80 : 40 }}>
      <Image
        src={src}
        alt={alt}
        width={isCoinDetailsPage ? 80 : 40}
        height={isCoinDetailsPage ? 80 : 40}
        className={cn("w-10 h-10 rounded-full object-cover", isCoinDetailsPage && "w-20 h-20")}
      />
      {networkSrc && (
        <NetworkBadge
          src={networkSrc}
          alt={`${network || ""} Network`}
        />
      )}
    </div>
  );
}

function NetworkBadge({
  src,
  alt
}: {
  src: string;
  alt: string;
}) {
  const pathname = usePathname();
  const isCoinDetailsPage = pathname.startsWith("/crypto/details");

  return (
    <div className={cn("absolute bottom-0 right-0 h-4 w-4", isCoinDetailsPage && "w-7 h-7")}>
      <Image
        src={src}
        alt={alt}
        width={isCoinDetailsPage ? 30 : 15}
        height={isCoinDetailsPage ? 30 : 15}
        className={cn("border border-gray-300 bg-white h-4 w-4 rounded-full", isCoinDetailsPage && "w-7 h-7")}
      />
    </div>
  );
}

export default CryptoImage